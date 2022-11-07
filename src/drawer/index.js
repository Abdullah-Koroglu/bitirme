import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CustomDrawer from '../components/Drawer'
import HomeScreen from '../pages/Home'
import TourScreen from '../pages/Tour';

const Drawer = createDrawerNavigator ();

export default function App () {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>} initialRouteName="Home">
        <Drawer.Screen name="Ana Sayfa" component={HomeScreen} />
        <Drawer.Screen name="Sanal Tur" component={TourScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}