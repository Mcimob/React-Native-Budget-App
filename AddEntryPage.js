import React, {useState} from 'react';
import {Text, View, Button} from 'react-native';
import {TextInput} from 'react-native-paper';
import styles from './styles.js';
import {Row, Col} from './components.js';

export default function AddEntryPage({navigation}) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('0');

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
            <Text style={styles.textBasic}>Enter an Amount</Text>
          </Col>
          <Col>
            <TextInput
              style={styles.inputBox}
              inputMode="numeric"
              placeHolder="Enter an amount"
              onChnageText={newAmount => setAmount(newAmount)}
              defaultValue={amount}
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
