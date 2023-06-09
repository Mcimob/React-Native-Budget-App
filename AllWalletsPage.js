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
import styles, {smoothWidthChange, smoothChange} from './styles.js';
import {Icon} from './Icon';
import {getDBConnection, getItems, removeItem} from './db.js';
import {
  UpperRightEditButton,
  ViewAnimatedOpacity,
  MinusButton,
  EditButton,
} from './components.js';

var db = getDBConnection();

export default function AllWalletsPage({navigation}) {
  const [walletList, setWalletList] = useState([]);
  const [editState, setEditState] = useState(false);
  const [buildState, setBuildState] = useState(false);

  const [width, setWidth] = useState(0);
  const [x, setX] = useState(0);
  const [opac, setOpac] = useState(0);

  var animWidth = new Animated.Value(width);
  var animX = new Animated.Value(x);
  var animOpac = new Animated.Value(opac);

  useEffect(() => {
    smoothChange(animOpac, editState ? 1 : 0, 500).start(({finished}) =>
      setOpac(editState ? 1 : 0),
    );
  }, [editState]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getItems(db, setWalletList, 'wallet');
    });
    return focusHandler;
  }, [navigation]);

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
          extraData={walletList}
          style={[styles.itemList, {opacity: buildState ? 1 : 0}]}
          data={walletList}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={({item}) =>
            WalletItem({navigation, item}, editState, setWalletList, animOpac)
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
        onPress={() => navigation.navigate('ConfigWallet', {})}>
        <Icon type="ant" name="plus" size={40} color="white" />
      </Pressable>
    </View>
  );
}

function WalletItem({navigation, item}, editState, setWalletList, animOpac) {
  return (
    <View style={[styles.row, styles.center, styles.pad10]}>
      {editState ? (
        <ViewAnimatedOpacity animVal={animOpac}>
          <EditButton
            item={item}
            handleEdit={handleEdit}
            navigation={navigation}
          />
        </ViewAnimatedOpacity>
      ) : null}
      <View style={styles.item}>
        <Text style={styles.textBasic}>{item.title}</Text>
        <Icon type={item.icon_source} name={item.icon_name} />
      </View>
      {editState && (
        <ViewAnimatedOpacity animVal={animOpac}>
          {item.id != 1 ? (
            <MinusButton
              handleDelete={handleDelete}
              item={item}
              setEntries={setWalletList}
            />
          ) : (
            <View style={{width: 20}} />
          )}
        </ViewAnimatedOpacity>
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
  navigation.navigate('ConfigWallet', {item});
}
