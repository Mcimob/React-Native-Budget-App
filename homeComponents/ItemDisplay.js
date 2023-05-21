import React from 'react';
import {View, Animated, SectionList, Text} from 'react-native';
import styles from '../styles';
import {Icon} from '../Icon';
import {EntryItem, GridEntryItemContainer} from './EntryItems';

export default function ItemDisplay({
  togglePosition,
  toggleState,
  entries,
  sortBy,
  navigation,
  wallets,
  categories,
  editState,
  setEntries,
  categoriesSelected,
  walletsSelected,
  categoriesExcluded,
  walletsExcluded,
  dateRange,
  db,
}) {
  return (
    <View style={{height: '50%'}}>
      <Animated.View
        style={{
          opacity: togglePosition.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
          }),
          zIndex: toggleState ? 1 : 0,
          elevation: toggleState ? 1 : 0,
          width: '100%',
          height: '100%',
        }}>
        <SectionList
          extraData={[
            entries,
            sortBy,
            categoriesSelected,
            walletsSelected,
            dateRange,
          ]}
          key="grid"
          sections={groupEntries(
            entries,
            sortBy,
            true,
            {
              category: categoriesSelected,
              wallet: walletsSelected,
              date: dateRange,
            },
            {
              category: categoriesExcluded,
              wallet: walletsExcluded,
            },
          )}
          style={[styles.itemList]}
          renderItem={({item}) =>
            GridEntryItemContainer(
              {navigation, item},
              wallets,
              categories,
              editState,
              setEntries,
              toggleState,
              db
            )
          }
          renderSectionHeader={({section: {title}}) => (
            <SectionHeader
              list={
                sortBy == 'category'
                  ? categories
                  : sortBy == 'wallet'
                  ? wallets
                  : null
              }
              id={title}
            />
          )}
          ListFooterComponent={<View style={{height: 30}} />}
        />
      </Animated.View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            alignSelf: 'center',
            zIndex: toggleState ? 0 : 1,
            elevation: toggleState ? 0 : 1,
            width: '100%',
            height: '100%',
          },
          {
            opacity: togglePosition.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0, 0],
            }),
          },
        ]}>
        <SectionList
          extraData={[entries, sortBy, categoriesSelected, walletsSelected]}
          key="list"
          sections={groupEntries(
            entries,
            sortBy,
            false,
            {
              category: categoriesSelected,
              wallet: walletsSelected,
              date: dateRange,
            },
            {
              category: categoriesExcluded,
              wallet: walletsExcluded,
            },
          )}
          renderItem={({item}) =>
            EntryItem(
              {navigation, item},
              wallets,
              categories,
              editState,
              setEntries,
              toggleState,
              db,
            )
          }
          ListFooterComponent={<View style={{height: 30}} />}
          renderSectionHeader={({section: {title}}) => (
            <SectionHeader
              list={
                sortBy == 'category'
                  ? categories
                  : sortBy == 'wallet'
                  ? wallets
                  : null
              }
              id={title}
            />
          )}
        />
      </Animated.View>
    </View>
  );
}

function SectionHeader({list, id}) {
  let title;
  let item = null;
  if (!list) {
    title = id;
  } else {
    item = list.filter(e => e.id == parseInt(id))[0];
    title = item.title;
  }
  return (
    <View style={[styles.row, {justifyContent: 'space-between'}, styles.pad10]}>
      <Text style={[styles.textBasic, styles.subTitle]}>{title}</Text>
      {item && <Icon type={item.icon_source} name={item.icon_name} />}
    </View>
  );
}

function filterEntriesBy(entries, filters, exclusions) {
  let filteredEntries = entries;

  let start = filters.date.dateRange[0].getTime();
  let end = filters.date.dateRange[1].getTime();

  filteredEntries = filteredEntries.filter(x => {
    return x.dateAdded.getTime() >= start && x.dateAdded.getTime() <= end;
  });

  [('wallet', 'category')].forEach(itemType => {
    let itemFilters = filters[itemType];
    if (itemFilters.length != 0) {
      if (new Set(itemFilters.map(x => x.selected)).size != 1) {
        let entryToSelected = {};
        itemFilters.forEach(x => (entryToSelected[x.id] = x.selected));
        let exclusionStatus = exclusions[itemType];
        filteredEntries = filteredEntries.filter((item, index) =>
          entryToSelected[item[itemType + '_id']]
            ? !exclusionStatus
            : exclusionStatus,
        );
      }
    }
  });
  return filteredEntries;
}

function sortEntriesBy(entries, sortBy) {
  let out = [];
  let dic = {};
  for (let e of entries) {
    if (!Object.keys(dic).includes(e.wallet_id.toString())) {
      dic[e[sortBy + '_id']] = {title: e[sortBy + '_id'], data: []};
    }
    dic[e[sortBy + '_id']].data.push(e);
  }
  for (let key of Object.keys(dic)) {
    out.push(dic[key]);
  }
  return out;
}

function groupEntries(entries, sortBy, isGrid, filters, exclusions) {
  if (!entries) {
    return [];
  }
  let filteredEntries = filterEntriesBy(entries, filters, exclusions);

  let out = [];
  if (['wallet', 'category'].includes(sortBy)) {
    out = sortEntriesBy(filteredEntries, sortBy);
  } else if (sortBy == 'none') {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let dic = {};
    for (let e of filteredEntries) {
      let date = new Date(e.dateAdded);
      let year_month = months[date.getMonth()] + ' ' + date.getFullYear();
      if (!Object.keys(dic).includes(year_month)) {
        dic[year_month] = {title: year_month, data: []};
      }
      dic[year_month].data.push(e);
    }

    for (let key of Object.keys(dic)) {
      out.push(dic[key]);
    }
  }
  if (isGrid) {
    for (let group of out) {
      group.data = bundleForRenderEntries(group.data);
    }
  }
  return out;
}

function bundleForRenderEntries(entries) {
  let out = [];

  for (let i = 0; i < entries.length; i += 2) {
    out.push([entries[i], i + 1 < entries.length ? entries[i + 1] : null]);
  }
  return out;
}
