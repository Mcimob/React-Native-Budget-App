import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, Pressable, Alert} from 'react-native';
import styles from './styles.js';
import {Icon} from './Icon';
import {getDBConnection, getItems, removeItem} from './db.js';

var db = getDBConnection();

export default function AllWalletsPage({navigation}) {
  const [walletList, setWalletList] = useState([]);
  const [editState, setEditState] = useState(false);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getItems(db, setWalletList, 'wallet');
    });
    return focusHandler;
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => EditButton(editState, setEditState),
    });
  });

  return (
    <View style={styles.inputPage}>
      <View>
        <FlatList
          extraData={walletList}
          style={styles.itemList}
          data={walletList}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={({item}) =>
            WalletItem({item}, editState, setWalletList, navigation)
          }
        />
      </View>
    </View>
  );
}

function WalletItem({item}, editState, setWalletList, navigation) {
  return (
    <View style={[styles.row, {justifyContent: 'flex-start'}]}>
      {editState && (
        <Pressable onPress={() => handleEdit(item, navigation)}>
          <Icon
            style={styles.deleteIcon}
            type="ant"
            name="edit"
            size={20}
            color="#000"
          />
        </Pressable>
      )}
      <View style={styles.item}>
        <Text style={styles.textBasic}>{item.title}</Text>
        <Icon
          type={item.icon_source}
          name={item.icon_name}
          size={30}
          color="#000"
        />
      </View>
      {editState && item.id != 1 && (
        <Pressable onPress={() => handleDelete(item, setWalletList)}>
          <Icon
            style={styles.deleteIcon}
            type="ant"
            name="minuscircle"
            size={20}
            color="#000"
          />
        </Pressable>
      )}
    </View>
  );
}

function handleDelete(item, setWalletList) {
  Alert.alert(
    'Delete',
    'Are you sure, you want to delete ' + item.title + '?',
    [
      {
        text: 'Yes',
        onPress: () => {
          removeItem(item.id, db, 'wallet');
          getItems(db, setWalletList, 'wallet');
        },
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ],
  );
}

function handleEdit(item, navigation) {
  navigation.navigate('AddPage', {screen: 'AddWallet', params: item});
}

function EditButton(editState, setEditState) {
  return (
    <Pressable onPress={() => setEditState(!editState)}>
      <Icon type="ant" name="edit" size={30} color="#000" />
    </Pressable>
  );
}
