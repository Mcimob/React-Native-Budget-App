import React, {useEffect, useState} from 'react';
import {FlatList, Text, Pressable, Animated, View, Alert} from 'react-native';
import {getDBConnection, createTables, getItems, removeItem} from './db';
import styles from './styles';
import {Icon} from './Icon';
import {UpperRightEditButton, Separator} from './components';

let db = getDBConnection();

export default function HomeScreen({navigation}) {
  const [entries, setEntries] = useState(null);
  const [wallets, setWallets] = useState(null);
  const [categories, setCategories] = useState(null);

  const [editState, setEditState] = useState(false);

  const [total, setTotal] = useState(0);

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
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <Text style={[styles.textBasic, styles.subTitle]}>All Entries:</Text>
      </View>
      <Separator />
      <FlatList
        data={entries}
        style={styles.itemList}
        numColumns={1}
        renderItem={({item}) =>
          EntryItem(
            {navigation, item},
            wallets,
            categories,
            editState,
            setEntries,
          )
        }
      />
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
  animOpac,
) {
  return (
    <View style={[styles.row, styles.center]}>
      {editState && (
        <Animated.View style={{opacity: animOpac}}>
          <Pressable onPress={() => handleEdit(item, navigation)}>
            <Icon
              style={styles.deleteIcon}
              type="ant"
              name="edit"
              size={20}
              color="#fff"
            />
          </Pressable>
        </Animated.View>
      )}
      <View style={[styles.item, {width: '80%'}]}>
        <Text style={[styles.textBasic]}>{item.title}</Text>
        <Text style={styles.textBasic}>CHF {item.amount}</Text>
        {/*
        <View style={[styles.row, styles.center]}>
          <Icon
            type={getItemById(wallets, item.wallet_id).icon_source}
            name={getItemById(wallets, item.wallet_id).icon_name}
            size={30}
            color="white"
            style={{margin: 10}}
          />
          <Icon
            type={getItemById(categories, item.category_id).icon_source}
            name={getItemById(categories, item.category_id).icon_name}
            size={30}
            color="white"
          />
        </View>
        */}
      </View>
      {editState && (
        <Animated.View style={{opacity: animOpac}}>
          <Pressable onPress={() => handleDelete(item, setEntries)}>
            <Icon
              style={styles.deleteIcon}
              type="ant"
              name="minuscircle"
              size={20}
              color="#fff"
            />
          </Pressable>
        </Animated.View>
      )}
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
          getItems(db, setter, 'catentryegory');
        },
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ],
  );
}

function getItemById(list, id) {
  return list.filter(item => item.id == id)[0];
}
