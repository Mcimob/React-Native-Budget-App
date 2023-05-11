import React from 'react';
import styles from './styles';
import {View, Text} from 'react-native';

export default function OptionsPage({navigation}) {
  return (
    <View style={[styles.roundedBox, styles.black]}>
      <Text style={[styles.buttonText]}>Options Page</Text>
    </View>
  );
}
