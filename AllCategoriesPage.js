import React, {useState, useEffect} from 'react';
import {Text, View, FlatList, Pressable, Alert} from 'react-native';
import styles from './styles.js';
import {Icon} from './Icon';
import {getDBConnection, getItems, removeItem} from './db.js';

var db = getDBConnection();

export default function AllCategoriesPage({navigation}) {
  const [catList, setCatList] = useState([]);
  const [editState, setEditState] = useState(false);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getItems(db, setCatList, 'category');
      console.log(catList);
    });
    return focusHandler;
  }, [navigation, catList]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => EditButton(editState, setEditState),
    });
  });

  return (
    <View style={styles.inputPage}>
      <View>
        <FlatList
          extraData={catList}
          style={styles.itemList}
          data={catList}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={({item}) =>
            CategoryItem({item}, editState, setCatList, navigation)
          }
        />
      </View>
    </View>
  );
}

function CategoryItem({item}, editState, setCatList, navigation) {
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
        <Pressable onPress={() => handleDelete(item, setCatList)}>
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

function handleDelete(item, setCatList) {
  Alert.alert(
    'Delete',
    'Are you sure, you want to delete ' + item.title + '?',
    [
      {
        text: 'Yes',
        onPress: () => {
          removeItem(item.id, db, 'category');
          getItems(db, setCatList, 'category');
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
  navigation.navigate('AddPage', {screen: 'AddCatgory', params: item});
}

function EditButton(editState, setEditState) {
  return (
    <Pressable onPress={() => setEditState(!editState)}>
      <Icon type="ant" name="edit" size={30} color="#000" />
    </Pressable>
  );
}
