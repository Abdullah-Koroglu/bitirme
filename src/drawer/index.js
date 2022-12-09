import * as React from 'react';
import {useEffect, useContext} from 'react';
import { StateContext } from "../context/StateContext";
import { Button, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomDrawer from '../components/Drawer'
import HomeScreen from '../pages/Home'
import TourScreen from '../pages/Tour';
import EventsScreen from '../pages/events/list';
import EventDetailScreen from '../pages/events/detail';
import HowtoScreen from '../pages/howto/list';
import HowtoDetailScreen from '../pages/howto/detail';
import TransportationScreen from '../pages/Transportation';
import DirectoryScreen from '../pages/Directory';
import MailScreen from '../pages/Mail';
import LinksScreen from '../pages/Links';
import ReportScreen from '../pages/Report';

const Drawer = createDrawerNavigator ();
const Stack = createNativeStackNavigator();

export default function App () {
  const [,,,,setRoutes] = useContext (StateContext)
  const EventStack = () => {
    return <Stack.Navigator initialRouteName="Etkinlikler List" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Etkinlikler Detay" component={EventDetailScreen} />
      <Stack.Screen name="Etkinlikler List" component={EventsScreen} />
    </Stack.Navigator>
  }

  const HowtoStack = () => {
    return <Stack.Navigator initialRouteName="Nasil List" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Nasil Detay" component={HowtoDetailScreen} />
      <Stack.Screen name="Nasil List" component={HowtoScreen} />
    </Stack.Navigator>
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}>{
          useEffect  (() => {
            setRoutes (props.state.routeNames)
          }, [])
  }</CustomDrawer>} initialRouteName="Ana Sayfa">
        <Drawer.Screen name="Ana Sayfa" component={HomeScreen} />
        <Drawer.Screen name="Nasıl Yaparım" component={HowtoStack} />
        <Drawer.Screen name="Sanal Tur" component={TourScreen} />
        <Drawer.Screen name="Etkinlikler" component={EventStack} />
        <Drawer.Screen name="Resmi E-posta" component={MailScreen} />
        <Drawer.Screen name="Telefon Rehberi" component={DirectoryScreen} />
        <Drawer.Screen name="Öneri ve Şikayet" component={ReportScreen} />
        <Drawer.Screen name="Ulaşım" component={TransportationScreen} />
        <Drawer.Screen name="Linkler" component={LinksScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}