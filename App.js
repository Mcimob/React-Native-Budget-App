/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainPage from './mainPage';
import AddWalletPage from './ConfigWalletPage';
import ConfigCategory from './ConfigCategoryPage';
import ConfigEntryPage from './ConfigEntryPage';
import {header_style} from './styles';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="main"
          component={MainPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ConfigWallet"
          component={AddWalletPage}
          options={header_style}
        />
        <Stack.Screen
          name="ConfigCategory"
          component={ConfigCategory}
          options={header_style}
        />
        <Stack.Screen
          name="ConfigEntry"
          component={ConfigEntryPage}
          options={header_style}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();
