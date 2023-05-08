import React from 'react';
import {View} from 'react-native';
import {TextInput} from 'react-native-paper';
import styles from './styles';

export function Col({numRows = 2, children}) {
  return <View style={styles[`${numRows}col`]}>{children}</View>;
}

export function Row({children}) {
  return <View style={styles.row}>{children}</View>;
}

export function CustomTextInput({placeholder, text, setText}) {
  return (
    <TextInput
      style={styles.inputBox}
      placeholder={placeholder}
      onChangeText={newText => setText(newText)}
      defaultValue={text}
      mode="flat"
      activeUnderlineColor="blue"
      underlineColor="lightgray"
      textColor="black"
    />
  );
}
