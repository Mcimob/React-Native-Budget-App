import React, {useState} from 'react';
import {Text, View, Pressable, Alert, Animated} from 'react-native';
import styles, {smoothChange} from './styles.js';
import {Row, Col, CustomTextInput} from './components.js';
import IconPicker from './IconPicker.js';
import {Icon} from './Icon.js';
import {getDBConnection, addItem, editItem} from './db.js';

var db = getDBConnection();

const default_icon = {name: 'wallet', source: 'ant'};

export default function ConfigWalletPage({navigation, route}) {
  var item = Object.keys(route.params).includes('item')
    ? route.params.item
    : null;
  var id = item && item.id;
  const [title, setTitle] = useState(item ? item.title : '');
  const [icon, setIcon] = useState(
    item ? {name: item.icon_name, source: item.icon_source} : default_icon,
  );
  const [modalVisible, setModalVisible] = useState(false);

  var diameterAnim = new Animated.Value(0);

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
            {flexDirection: 'column', justifyContent: 'center'},
          ]}
          onPress={() =>
            handleSubmit(id, title, icon, navigation, diameterAnim)
          }>
          <Text style={[styles.buttonText]}>
            Submit {id ? '' : 'new'} Wallet
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
      <IconPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setIcon={setIcon}
      />
    </View>
  );
}

function handleSubmit(id, title, icon, navigation, diameterAnim) {
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
