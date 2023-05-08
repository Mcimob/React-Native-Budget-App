/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './Home';
import AddPage from './AddPage';
import AllWalletsPage from './AllWalletsPage';
import {Button} from 'react-native-paper';

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddPage" component={AddPage} />
        <Stack.Screen
          name="ViewWallets"
          component={AllWalletsPage}
          options={{headerRight: () => {}}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

export default App;
