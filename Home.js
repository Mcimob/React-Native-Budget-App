import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

export default function HomeScreen({navigation}) {
  return (
    <View>
      <Button
        title="Go to AddPage"
        onPress={() => navigation.navigate('AddPage')}
      />
    </View>
  );
}
