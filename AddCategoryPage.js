import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import styles from './styles.js';
import {Row, Col} from './components.js';

export default function AddWalletPage({navigation}) {
  const [title, setTitle] = useState('');

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
      </View>
    </View>
  );
}
