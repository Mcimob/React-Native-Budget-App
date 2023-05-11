import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import styles, {smoothWidthChange} from './styles.js';
import {Icon} from './Icon';
import {getDBConnection, getItems, removeItem} from './db.js';
import {UpperRightEditButton} from './components.js';

var db = getDBConnection();

export default function AllCategoriesPage({navigation}) {
  const [catList, setCatList] = useState([]);
  const [editState, setEditState] = useState(false);
  const [buildState, setBuildState] = useState(false);

  const [width, setWidth] = useState(0);
  const [x, setX] = useState(0);
  const [opac, setOpac] = useState(0);

  var animWidth = new Animated.Value(width);
  var animX = new Animated.Value(x);
  var animOpac = new Animated.Value(opac);

  useEffect(() => {
    Animated.timing(animOpac, {
      toValue: editState ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(({finished}) => setOpac(editState ? 1 : 0));
  }, [editState]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getItems(db, setCatList, 'category');
    });
    return focusHandler;
  }, [navigation, catList]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <UpperRightEditButton state={editState} setState={setEditState} />
      ),
    });
  });

  return (
    <View>
      <View style={styles.inputPage}>
        <FlatList
          onLayout={event =>
            smoothWidthChange(
              event,
              animWidth,
              animX,
              setWidth,
              setX,
              setBuildState,
            )
          }
          extraData={catList}
          style={styles.itemList}
          data={catList}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={({item}) =>
            CategoryItem({navigation, item}, editState, setCatList, animOpac)
          }
        />
        <Animated.View
          style={[
            {
              left: animX,
              width: animWidth,
              opacity: buildState ? 1 : 0,
            },
            styles.itemListBackground,
          ]}
        />
      </View>
      <Pressable
        style={styles.floatingButton}
        onPress={() => navigation.navigate('ConfigCategory', {})}>
        <Icon type="ant" name="plus" size={40} color="white" />
      </Pressable>
    </View>
  );
}

function CategoryItem({navigation, item}, editState, setCatList, animOpac) {
  return (
    <View style={[styles.row, {justifyContent: 'flex-start'}]}>
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
      <View style={styles.item}>
        <Text style={styles.textBasic}>{item.title}</Text>
        <Icon
          type={item.icon_source}
          name={item.icon_name}
          size={30}
          color="#fff"
        />
      </View>
      {editState && item.id != 1 && (
        <Animated.View style={{opacity: animOpac}}>
          <Pressable onPress={() => handleDelete(item, setCatList)}>
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
  navigation.navigate('ConfigCategory', {item});
}
