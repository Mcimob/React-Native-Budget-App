import React, {useEffect, useState} from 'react';
import {FlatList, Text, Pressable, Animated, View, Alert} from 'react-native';
import {getDBConnection, createTables, getItems, removeItem} from './db';
import styles, {smoothChange} from './styles';
import {Icon} from './Icon';
import {
  UpperRightEditButton,
  Separator,
  MinusButton,
  EditButton,
  ViewAnimatedOpacity,
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

  /*useEffect(() => {
    console.log('toggle');
  }, [toggleState]);*/

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
      <Separator />
      <View>
        <Animated.View
          style={{
            opacity: togglePosition.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0, 1],
            }),
            zIndex: toggleState ? 1 : 0,
            elevation: toggleState ? 1 : 0,
          }}>
          <FlatList
            key="grid"
            data={entries}
            style={[styles.itemList, {width: '100%'}]}
            numColumns={2}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            renderItem={({item}) =>
              GridEntryItem(
                {navigation, item},
                wallets,
                categories,
                editState,
                setEntries,
                toggleState,
              )
            }
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              alignSelf: 'center',
              zIndex: toggleState ? 0 : 1,
              elevation: toggleState ? 0 : 1,
            },
            {
              opacity: togglePosition.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 0],
              }),
            },
          ]}>
          <FlatList
            key="list"
            data={entries}
            style={[styles.itemList, {width: '100%'}]}
            numColumns={1}
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
          />
        </Animated.View>
      </View>
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

function GridEntryItem(
  {navigation, item},
  wallets,
  categories,
  editState,
  setEntries,
  toggleState,
) {
  let wallet = getItemById(wallets, item.wallet_id);
  let category = getItemById(categories, item.category_id);

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
          {justifyContent: 'space-between', width: '90%', marginTop: 5},
        ]}>
        <View style={{opacity: editState ? 1 : 0}}>
          <EditButton
            handleEdit={handleEdit}
            item={item}
            navigation={navigation}
            disabled={!toggleState}
          />
        </View>
        <View style={{opacity: editState ? 1 : 0}}>
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
