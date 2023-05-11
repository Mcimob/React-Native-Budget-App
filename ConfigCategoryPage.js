import React, {useState} from 'react';
import {Text, View, Pressable, Alert, Animated} from 'react-native';
import styles, {smoothChange} from './styles.js';
import {Row, Col, CustomTextInput} from './components.js';
import {getDBConnection, editItem, addItem} from './db.js';
import {Icon} from './Icon.js';
import IconPicker from './IconPicker.js';

const default_icon = {name: 'shopping-bag', source: 'feather'};

var db = getDBConnection();

export default function ConfigCategory({navigation, route}) {
  var item = Object.keys(route.params).includes('item')
    ? route.params.item
    : null;
  const id = item && item.id;
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
            <Text style={styles.textBasic}>
              Select an Icon for the Category
            </Text>
          </Col>
          <Col>
            <Pressable
              style={styles.iconContainer}
              onPress={() => setModalVisible(true)}>
              <Icon
                type={icon.source}
                name={icon.name}
                size={30}
                color="white"
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
            Submit {item ? '' : 'new'} Category
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
      'category',
    );
  } else {
    addItem(
      {title: title, icon_name: icon.name, icon_source: icon.source},
      db,
      'category',
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
