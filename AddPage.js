import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AddEntryPage from './AddEntryPage';
import AddCategoryPage from './AddCategoryPage';
import AddWalletPage from './AddWalletPage';

const Tab = createMaterialTopTabNavigator();

export default function AddPage({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName="AddEntry"
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarStyle: {backgroundColor: 'black'},
      }}>
      <Tab.Screen
        name="AddEntry"
        component={AddEntryPage}
        options={{tabBarLabel: 'Entry'}}
      />
      <Tab.Screen
        name="AddWallet"
        component={AddWalletPage}
        options={{tabBarLabel: 'Wallet'}}
      />
      <Tab.Screen
        name="AddCatgory"
        component={AddCategoryPage}
        options={{tabBarLabel: 'Category'}}
      />
    </Tab.Navigator>
  );
}
