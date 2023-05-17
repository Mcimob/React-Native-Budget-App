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
          extraData={[entries, sortBy]}
          key="grid"
          sections={groupEntries(entries, sortBy, true)}
          style={[styles.itemList]}
          renderItem={({item}) =>
            GridEntryItemContainer(
              {navigation, item},
              wallets,
              categories,
              editState,
              setEntries,
              toggleState,
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
          key="list"
          sections={groupEntries(entries, sortBy, false)}
          renderItem={({item}) =>
            EntryItem(
              {navigation, item},
              wallets,
              categories,
              editState,
              setEntries,
              toggleState,
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

function groupEntries(entries, sortBy, isGrid) {
  let out = [];
  if (sortBy == 'wallet') {
    let dic = {};
    for (let e of entries) {
      if (!Object.keys(dic).includes(e.wallet_id.toString())) {
        dic[e.wallet_id] = {title: e.wallet_id, data: []};
      }
      dic[e.wallet_id].data.push(e);
    }
    for (let key of Object.keys(dic)) {
      out.push(dic[key]);
    }
  } else if (sortBy == 'category') {
    let dic = {};
    for (let e of entries) {
      if (!Object.keys(dic).includes(e.category_id.toString())) {
        dic[e.category_id] = {title: e.category_id, data: []};
      }
      dic[e.category_id].data.push(e);
    }

    for (let key of Object.keys(dic)) {
      out.push(dic[key]);
    }
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
    for (let e of entries) {
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
