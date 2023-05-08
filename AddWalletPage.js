import React, {useState} from 'react';
import {Text, View, Pressable, Alert} from 'react-native';
import {TextInput} from 'react-native-paper';
import styles from './styles.js';
import {Row, Col, CustomTextInput} from './components';
import IconPicker from './IconPicker';
import {Icon} from './Icon';
import {getDBConnection, addItem, editItem} from './db.js';

var db = getDBConnection();

export default function AddWalletPage({navigation, route}) {
  const id = route.params && route.params.id;
  const [title, setTitle] = useState(id ? route.params.title : '');
  const [icon, setIcon] = useState(
    id
      ? {name: route.params.icon_name, source: route.params.icon_source}
      : {name: 'wallet', source: 'ant'},
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [styleState, setStyleState] = useState(0);

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
              text={title}
              setText={setTitle}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Text style={styles.textBasic}>Select an Icon for the Wallet</Text>
          </Col>
          <Col>
            <Pressable
              style={styles.iconContainer}
              onPress={() => setModalVisible(true)}>
              <Icon
                type={icon.source}
                name={icon.name}
                size={30}
                color="#fff"
              />
            </Pressable>
          </Col>
        </Row>
        <Pressable
          style={[
            styles.roundedBox,
            styles.black,
            styleState == 1 && styles.buttonHover,
          ]}
          onPress={() =>
            handleSubmit(id, title, icon, setStyleState, navigation)
          }>
          <Text
            style={[
              styles.buttonText,
              styleState == 1 && styles.buttonHoverText,
            ]}>
            Submit {id ? '' : 'new'} Wallet
          </Text>
        </Pressable>
      </View>
      <IconPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setIcon={setIcon}
      />
    </View>
  );
}

function handleSubmit(id, title, icon, styleSetter, navigation) {
  styleSetter(1);
  if (id) {
    editItem(
      {
        id: id,
        title: title,
        icon_name: icon.name,
        icon_source: icon.source,
      },
      db,
      'wallet',
    );
  } else {
    addItem(
      {title: title, icon_name: icon.name, icon_source: icon.source},
      db,
      'wallet',
    );
  }
  Alert.alert(
    'Success!',
    id ? 'Entry successfully updated' : 'New entry successfully added',
    [
      {
        text: 'OK',
        onPress: () => {
          styleSetter(0);
          if (id) {
            navigation.navigate('All Wallets');
          }
        },
      },
    ],
  );
}
