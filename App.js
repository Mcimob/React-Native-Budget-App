/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from './Home';
import AddPage from './AddPage';
import AllWalletsPage from './AllWalletsPage';
import {Icon} from './Icon';
import AllCategoriesPage from './AllCategoriesPage';

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focussed, color, size}) => {
            let iconName;
            let iconSource = 'ant';
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'AddPage':
                iconName = 'pluscircleo';
                break;
              case 'All Wallets':
                iconName = 'wallet';
                break;
              case 'All Categories':
                iconName = 'category';
                iconSource = 'material';
                break;
            }
            return (
              <Icon type={iconSource} name={iconName} size={20} color="black" />
            );
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="AddPage" component={AddPage} />
        <Tab.Screen
          name="All Wallets"
          component={AllWalletsPage}
          options={{headerRight: () => {}}}
        />
        <Tab.Screen
          name="All Categories"
          component={AllCategoriesPage}
          otions={{headerRight: () => {}}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const Tab = createBottomTabNavigator();

export default App;
