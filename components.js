import React from 'react';
import {View, Pressable, TextInput} from 'react-native';
import styles from './styles';
import {Icon} from './Icon';

export function Col({numRows = 2, children}) {
  return <View style={styles[`${numRows}col`]}>{children}</View>;
}

export function Row({children}) {
  return <View style={styles.row}>{children}</View>;
}

export function CustomTextInput({placeholder, text, setText, ...props}) {
  return (
    <TextInput
      style={[styles.roundedBox, styles.black, styles.accentBorder]}
      placeholder={placeholder}
      placeholderTextColor="#999"
      onChangeText={newText => setText(newText)}
      value={text}
      {...props}
    />
  );
}

export function UpperRightEditButton({state, setState}) {
  return (
    <Pressable onPress={() => setState(!state)}>
      <Icon type="ant" name="edit" size={30} color="#fff" />
    </Pressable>
  );
}
