import React, {useState, useEffect} from 'react';
import {Text, View, Pressable, FlatList, Animated, Alert} from 'react-native';
import Modal from 'react-native-modal';
import styles, {smoothChange} from './styles.js';
import {Row, Col, CustomTextInput, Separator} from './components.js';
import {Icon} from './Icon.js';
import {getDBConnection, getItem, getItems, editItem, addItem} from './db.js';

var db = getDBConnection();

export default function AddEntryPage({navigation, route}) {
  var item = Object.keys(route.params).includes('item')
    ? route.params.item
    : null;

  var id = item && item.id;

  const [title, setTitle] = useState(item ? item.title : '');
  const [amount, setAmount] = useState(item ? item.amount.toString() : '0');
  const [wallet, setWallet] = useState(null);
  const [category, setCategory] = useState(null);

  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  var diameterAnim = new Animated.Value(0);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      if (!item) {
        getItem(db, setWallet, 1, 'wallet');
        getItem(db, setCategory, 1, 'category');
      } else {
        getItem(db, setWallet, item.wallet_id, 'wallet');
        getItem(db, setCategory, item.category_id, 'category');
      }
    });
    return focusHandler;
  }, [navigation]);

  return (
    <View style={styles.inputPage}>
      <View style={styles.grid2}>
        <Row>
          <Col>
            <Text style={styles.textBasic}>Enter a title:</Text>
          </Col>
          <Col>
            <CustomTextInput
              placeholder="A good title"
              setText={setTitle}
              text={title}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={styles.textBasic}>Enter an Amount</Text>
          </Col>
          <Col>
            <CustomTextInput
              inputMode="numeric"
              placeHolder="Enter an amount"
              setText={setAmount}
              text={amount}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={styles.textBasic}>Choose a Wallet</Text>
          </Col>
          <Col>
            {wallet && (
              <Pressable
                style={styles.iconContainer}
                onPress={() => setWalletModalVisible(true)}>
                <Icon
                  type={wallet.icon_source}
                  name={wallet.icon_name}
                  size={30}
                  color="white"
                />
              </Pressable>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={styles.textBasic}>Choose a Category</Text>
          </Col>
          <Col>
            {category && (
              <Pressable
                style={styles.iconContainer}
                onPress={() => setCategoryModalVisible(true)}>
                <Icon
                  type={category.icon_source}
                  name={category.icon_name}
                  size={30}
                  color="white"
                />
              </Pressable>
            )}
          </Col>
        </Row>
        <Pressable
          style={[
            styles.roundedBox,
            styles.black,
            {flexDirection: 'column', justifyContent: 'center'},
          ]}
          onPress={() =>
            handleSubmit(
              id,
              title,
              amount,
              wallet,
              category,
              navigation,
              diameterAnim,
            )
          }>
          <Text style={[styles.buttonText]}>
            Submit {id ? '' : 'new'} Entry
          </Text>
          <Animated.View
            style={[
              styles.buttonEffect,
              {
                width: diameterAnim,
                height: diameterAnim,
                borderRadius: diameterAnim,
              },
            ]}
          />
        </Pressable>
      </View>
      <ItemPicker
        db={db}
        itemType="wallet"
        setter={setWallet}
        modalVisible={walletModalVisible}
        setModalVisible={setWalletModalVisible}
      />
      <ItemPicker
        db={db}
        itemType="category"
        setter={setCategory}
        modalVisible={categoryModalVisible}
        setModalVisible={setCategoryModalVisible}
      />
    </View>
  );
}

function ItemPicker({db, itemType, setter, modalVisible, setModalVisible}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems(db, setItems, itemType);
  }, [modalVisible]);

  return (
    <Modal isVisible={modalVisible} hasBackdrop={false}>
      <View style={[styles.modalView, styles.accentBorder]}>
        <Pressable
          style={[styles.roundedBox, styles.black, styles.accentBorder]}
          onPress={() => {
            setModalVisible(false);
          }}>
          <Text style={styles.buttonText}>
            Close {capitalize(itemType)} picker
          </Text>
        </Pressable>
        <Text style={[styles.buttonText, styles.subTitle]}>
          {capitalize(itemType)}
        </Text>
        <FlatList
          style={[
            styles.iconList,
            styles.roundedBox,
            styles.accentBorder,
            styles.dark,
            {padding: 0},
          ]}
          ItemSeparatorComponent={<Separator />}
          data={items}
          numColumns={1}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Pressable
              style={[styles.row, styles.modalItemList]}
              onPress={() => handlePick(item, setter, setModalVisible)}>
              <Text
                style={[
                  styles.buttonText,
                  styles.accentBorder,
                  styles.roundedBox,
                  styles.black,
                ]}>
                {item.title}
              </Text>
              <View style={styles.iconContainer}>
                <Icon
                  type={item.icon_source}
                  name={item.icon_name}
                  size={20}
                  color="white"
                />
              </View>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function handlePick(item, setter, setModalVisible) {
  setter(item);
  setModalVisible(false);
}

function handleSubmit(
  id,
  title,
  amount,
  wallet,
  category,
  navigation,
  diameterAnim,
) {
  if (id) {
    editItem(
      {
        id: id,
        title: title,
        amount: amount,
        wallet_id: wallet.id,
        category_id: category.id,
      },
      db,
      'entry',
    );
  } else {
    addItem(
      {
        title: title,
        amount: amount,
        wallet_id: wallet.id,
        category_id: category.id,
      },
      db,
      'entry',
    );
  }
  smoothChange(diameterAnim, 500, 200).start(({finished}) =>
    Alert.alert(
      'Success!',
      id ? 'Entry successfully updated' : 'New entry successfully added',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    ),
  );
}
