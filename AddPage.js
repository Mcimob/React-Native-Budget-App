import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AddEntryPage from './ConfigEntryPage';
import AddCategoryPage from './ConfigCategoryPage';
import AddWalletPage from './ConfigWalletPage';

const Tab = createMaterialTopTabNavigator();

export default function AddPage({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName="AddEntry"
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        unmountOnBlur: true,
        tabBarStyle: {backgroundColor: 'black'},
      }}>
      <Tab.Screen
        name="AddEntry"
        component={AddEntryPage}
        options={{tabBarLabel: 'Entry', initialParams: {id: null}}}
      />
      <Tab.Screen
        name="AddWallet"
        component={AddWalletPage}
        options={{tabBarLabel: 'Wallet', initialParams: {id: null}}}
        initialParams={{}}
      />
      <Tab.Screen
        name="AddCatgory"
        component={AddCategoryPage}
        options={{tabBarLabel: 'Category'}}
        initialParams={{}}
      />
    </Tab.Navigator>
  );
}
