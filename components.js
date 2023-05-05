import React, {useState} from 'react';
import {View, Pressable, Text, TextInput, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import AntGlyphMap from 'react-native-vector-icons/glyphmaps/AntDesign.json';

function Col({numRows = 2, children}) {
  return <View style={styles[`${numRows}col`]}>{children}</View>;
}

function Row({children}) {
  return <View style={styles.row}>{children}</View>;
}

export {Row, Col};
