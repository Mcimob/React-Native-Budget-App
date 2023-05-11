import React, {useState} from 'react';
import {Text, View} from 'react-native';
import styles from './styles.js';
import {Row, Col, CustomTextInput} from './components.js';

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
      </View>
    </View>
  );
}
