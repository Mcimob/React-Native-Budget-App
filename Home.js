import React, {useEffect, useState} from 'react';
import {
  Text,
  Pressable,
  Animated,
  View,
  Alert,
  SectionList,
} from 'react-native';
import Picker from '@ouroboros/react-native-picker';
import {getDBConnection, createTables, getItems, removeItem} from './db';
import styles, {smoothChange} from './styles';
import {Icon} from './Icon';
import {
  UpperRightEditButton,
  Separator,
  MinusButton,
  EditButton,
  ViewAnimatedOpacity,
  Row,
  Col,
} from './components';

let db = getDBConnection();

export default function HomeScreen({navigation}) {
  const [entries, setEntries] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [categories, setCategories] = useState(null);

  const [editState, setEditState] = useState(false);

  const [total, setTotal] = useState(0);

  const [toggleState, setToggleState] = useState(false);
  var togglePosition = new Animated.Value(toggleState ? 1 : 0);

  const [sortBy, setSortBy] = useState('none');

  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  var filterMenuHeight = new Animated.Value(filterMenuVisible ? 200 : 0);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getItems(db, setEntries, 'entry');
      getItems(db, setWallets, 'wallet');
      getItems(db, setCategories, 'category');
    });
    return focusHandler;
  }, [navigation, entries]);

  useEffect(() => {
    if (entries) {
      let sum = 0;
      entries.forEach(item => (sum += item.amount));
      setTotal(sum);
    }
  }, [entries]);

  useEffect(() => {
    createTables(db);
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <UpperRightEditButton state={editState} setState={setEditState} />
      ),
    });
  });

  return (
    <View style={[styles.homePage]}>
      <View
        style={[styles.row, styles.pad10, {justifyContent: 'space-between'}]}>
        <Text style={[styles.textBasic, styles.subTitle]}>All Entries:</Text>
        <Pressable
          style={[styles.row, styles.toggleSelector]}
          onPress={() => {
            handleToggle(toggleState, setToggleState, togglePosition);
          }}>
          <Animated.View
            style={[
              styles.animatedToggleSelector,
              {
                left: togglePosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 40],
                }),
                width: togglePosition.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [50, 0, 50],
                }),
                height: togglePosition.interpolate({
                  inputRange: [-0, 0.5, 1],
                  outputRange: [50, 0, 50],
                }),
                borderRadius: togglePosition.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [25, 0, 25],
                }),
              },
            ]}
          />
          <Icon type="feather" name="list" color="white" />
          <Icon type="feather" name="grid" color="white" />
        </Pressable>
      </View>
      <View
        style={[styles.row, styles.pad10, {justifyContent: 'space-between'}]}>
        <View style={[styles.row, styles.center]}>
          <Text style={[styles.textBasic]}>Sort by:</Text>
          <Picker
            onChanged={setSortBy}
            options={[
              {value: 'none', text: 'None'},
              {value: 'wallet', text: 'Wallet'},
              {value: 'category', text: 'Category'},
            ]}
            value={sortBy}
            style={[
              styles.roundedBox,
              styles.accentBorder,
              styles.black,
              styles.pad10,
              {width: 100},
            ]}
          />
        </View>
        <View style={[styles.row, styles.center]}>
          <Text style={[styles.textBasic]}>Filter:</Text>
          <Pressable
            onPress={() => {
              handleFilterMenuToggle(
                filterMenuVisible,
                setFilterMenuVisible,
                filterMenuHeight,
              );
            }}>
            <Icon type="ant" name="filter" />
          </Pressable>
        </View>
      </View>
      <Separator />
      <Animated.View
        style={[
          {
            height: filterMenuHeight,
            width: '100%',
          },
        ]}>
        <Row>
          <Col>
            <Text style={styles.textBasic}>Category</Text>
          </Col>
          <Col>
            <Text style={styles.textBasic}>Wallet</Text>
          </Col>
          <Col>
            <Text style={styles.textBasic}>Date</Text>
            
          </Col>
        </Row>
      </Animated.View>
      <Separator />
      {entries && (
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
      )}
      <Separator />
      <View style={[styles.item, {alignSelf: 'center'}]}>
        <Text style={styles.textBasic}>Total:</Text>
        <Text style={styles.textBasic}>CHF {total}</Text>
      </View>
    </View>
  );
}

function EntryItem(
  {navigation, item},
  wallets,
  categories,
  editState,
  setEntries,
  toggleState,
) {
  return (
    <View style={[styles.row, styles.center, {paddingVertical: 5}]}>
      {editState && (
        <View>
          <EditButton
            handleEdit={handleEdit}
            item={item}
            navigation={navigation}
            disabled={toggleState}
          />
        </View>
      )}
      <View style={[styles.item, {width: '80%'}]}>
        <Text style={[styles.textBasic]}>{item.title}</Text>
        <Text style={[styles.textBasic, styles.greyedOutColor]}>
          {item.dateAdded.split(' ')[0]}
        </Text>
        <Text style={styles.textBasic}>CHF {item.amount}</Text>
      </View>
      {editState && (
        <View>
          <MinusButton
            handleDelete={handleDelete}
            item={item}
            setEntries={setEntries}
            disabled={toggleState}
          />
        </View>
      )}
    </View>
  );
}

function GridEntryItemContainer(
  {navigation, item},
  wallets,
  categories,
  editState,
  setEntries,
  toggleState,
) {
  let wallet_0 = getItemById(wallets, item[0].wallet_id);
  let wallet_1 = item[1] ? getItemById(wallets, item[1].wallet_id) : null;
  let category_0 = getItemById(categories, item[0].category_id);
  let category_1 = item[1]
    ? getItemById(categories, item[0].category_id)
    : null;
  if (item[1]) {
    return (
      <View style={styles.row}>
        <GridEntryItem
          navigation={navigation}
          item={item[0]}
          wallet={wallet_0}
          category={category_0}
          editState={editState}
          setEntries={setEntries}
          toggleState={toggleState}
        />
        <GridEntryItem
          navigation={navigation}
          item={item[1]}
          wallet={wallet_1}
          category={category_1}
          editState={editState}
          setEntries={setEntries}
          toggleState={toggleState}
        />
      </View>
    );
  }
  return (
    <GridEntryItem
      navigation={navigation}
      item={item[0]}
      wallet={wallet_0}
      category={category_0}
      editState={editState}
      setEntries={setEntries}
      toggleState={toggleState}
    />
  );
}

function GridEntryItem({
  navigation,
  item,
  wallet,
  category,
  editState,
  setEntries,
  toggleState,
}) {
  return (
    <View
      style={[
        styles.accentBorder,
        styles.roundedBox,
        styles.itemGridBox,
        styles.black,
      ]}>
      <View
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 5,
            height: 10,
          },
        ]}>
        <View style={[{opacity: editState ? 1 : 0}, styles.editButtonGrid]}>
          <EditButton
            handleEdit={handleEdit}
            item={item}
            navigation={navigation}
            disabled={!toggleState}
          />
        </View>
        <View style={[{opacity: editState ? 1 : 0}, styles.minusButtonGrid]}>
          <MinusButton
            handleDelete={handleDelete}
            item={item}
            setEntries={setEntries}
            disabled={!toggleState}
          />
        </View>
      </View>
      <Text style={[styles.textBasic, {textAlign: 'center', padding: 0}]}>
        {item.title}
      </Text>
      <View style={styles.row}>
        {wallet && category && (
          <View style={styles.row}>
            <Icon type={wallet.icon_source} name={wallet.icon_name} />
            <Icon type={category.icon_source} name={category.icon_name} />
          </View>
        )}
        <Text style={styles.textBasic}>CHF {item.amount}</Text>
      </View>
      <View style={[styles.row, {justifyContent: 'flex-end', width: '100%'}]}>
        <Text
          style={[
            styles.textBasic,
            styles.greyedOutColor,
            {paddingVertical: 0},
          ]}>
          {item.dateAdded.split(' ')[0]}
        </Text>
      </View>
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

function handleEdit(item, navigation) {
  navigation.navigate('ConfigEntry', {item});
}

function handleDelete(item, setter) {
  Alert.alert(
    'Delete',
    'Are you sure, you want to delete ' + item.title + '?',
    [
      {
        text: 'Yes',
        onPress: () => {
          removeItem(item.id, db, 'entry');
          getItems(db, setter, 'entry');
        },
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ],
  );
}

function handleFilterMenuToggle(toggleState, setToggleState, filterMenuHeight) {
  smoothChange(filterMenuHeight, toggleState ? 0 : 200, 200).start(
    ({finished}) => {
      setToggleState(!toggleState);
    },
  );
}

function handleToggle(toggleState, setToggleState, togglePosition) {
  smoothChange(togglePosition, toggleState ? 0 : 1, 500).start(({finished}) => {
    setToggleState(!toggleState);
  });
}

function getItemById(list, id) {
  if (!list) {
    return null;
  }
  return list.filter(item => item.id == id)[0];
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
