import React, {useEffect} from 'react';
import {View, Button} from 'react-native';
import {getDBConnection, createTables} from './db';

let db = getDBConnection();

export default function HomeScreen({navigation}) {
  useEffect(() => {
    createTables(db);
  });
  return (
    <View>
      <Button
        title="Go to AddPage"
        onPress={() => navigation.navigate('AddPage')}
      />
      <Button
        title="Go to AllWallets Page"
        onPress={() => navigation.navigate('All Wallets')}
      />
    </View>
  );
}
