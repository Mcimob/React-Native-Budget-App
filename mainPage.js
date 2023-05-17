import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from './Home';
import AllWalletsPage from './AllWalletsPage';
import {Icon} from './Icon';
import AllCategoriesPage from './AllCategoriesPage';
import OptionsPage from './OptionsPage';
import {Pressable} from 'react-native';
import styles, {header_style} from './styles';

const Tab = createBottomTabNavigator();

export default function MainPage({navigation}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focussed, color, size}) => {
          let iconName;
          let iconSource = 'ant';
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'All Wallets':
              iconName = 'wallet';
              break;
            case 'All Categories':
              iconName = 'category';
              iconSource = 'material';
              break;
            case 'Options':
              iconName = 'gear';
              iconSource = 'octicon';
              break;
          }
          return (
            <Icon type={iconSource} name={iconName} size={20} color="black" />
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={header_style} />
      <Tab.Screen
        name="All Wallets"
        component={AllWalletsPage}
        options={({headerRight: () => {}}, header_style)}
      />
      <Tab.Screen
        name="Add"
        component={AddButtonComponent}
        options={{
          tabBarButton: () => AddButton({navigation}),
        }}
      />
      <Tab.Screen
        name="All Categories"
        component={AllCategoriesPage}
        options={({headerRight: () => {}}, header_style)}
      />
      <Tab.Screen
        name="Options"
        component={OptionsPage}
        options={header_style}
      />
    </Tab.Navigator>
  );
}

function AddButtonComponent({navigation}) {
  return null;
}

function AddButton({navigation}) {
  return (
    <Pressable
      style={styles.addButtonBar}
      onPress={() => navigation.navigate('ConfigEntry', {})}>
      <Icon type="octicon" name="plus" size={40} color="white" />
    </Pressable>
  );
}
