import React, {useState} from 'react';
import {Text, View, Pressable} from 'react-native';
import {TextInput} from 'react-native-paper';
import styles from './styles.js';
import {Row, Col} from './components';
import IconPicker from './IconPicker';
import {Icon} from './Icon';

export default function AddWalletPage({navigation}) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState({name: 'back', source: 'ant'});
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.inputPage}>
      <View style={styles.grid2}>
        <Row>
          <Col>
            <Text style={styles.textBasic}>Enter a title:</Text>
          </Col>
          <Col>
            <TextInput
              style={styles.inputBox}
              placeholder="A good title"
              onChangeText={newTitle => setTitle(newTitle)}
              defaultValue={title}
              mode="flat"
              activeUnderlineColor="blue"
              underlineColor="lightgray"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Text>{modalVisible}</Text>
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
      </View>
      <IconPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setIcon={setIcon}
      />
    </View>
  );
}

function handleSubmit(id, iconName, iconSet, iconColor, backgroundColor) {
  console.log({id, iconName, iconSet, iconColor, backgroundColor});
}
