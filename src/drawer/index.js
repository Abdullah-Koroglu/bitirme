import * as React from 'react';
import {useEffect, useContext, useState} from 'react';
import { StateContext } from "../context/StateContext";
import { Button, View, Text, Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '../hooks/useNotifications';
import { NativeModules } from 'react-native'
import locales from '../locale'

import CustomDrawer from '../components/Drawer'
import HomeScreen from '../pages/Home'
import TourScreen from '../pages/Tour';
import MapScreen from '../pages/Map';
import EventsScreen from '../pages/events/list';
import EventDetailScreen from '../pages/events/detail';
import HowtoScreen from '../pages/howto/list';
import PlaceGroupsScreen from '../pages/PlaceGroups';
import PlaceScreen from '../pages/Place';
import HowtoDetailScreen from '../pages/howto/detail';
import TransportationScreen from '../pages/Transportation';
import DirectoryScreen from '../pages/Directory';
import MailScreen from '../pages/Mail';
import LinksScreen from '../pages/Links';
import ReportScreen from '../pages/Report';

const Drawer = createDrawerNavigator ();
const Stack = createNativeStackNavigator();

const handleLocale = () => {
  let locale = null /* await AsyncStorage.getItem('@locale') */;

  if (locale) {
    locale = Platform.OS === 'android' ?
    NativeModules.I18nManager.localeIdentifier :
    NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
  }

  if (locale === 'tr_TR' || locale === 'en_US') {
    return locale
  } else {
    return 'en_US'
  }
}

export default function App () {
  const {setRoutes,setLocale,locale} = useContext (StateContext)
  const { registerForPushNotificationsAsync, handleNotificationResponse } = useNotifications ()
  const OSLocale = Platform.OS === 'android' ?
  NativeModules.I18nManager.localeIdentifier :
  NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]

  const [localeInUse,setLocaleInUse] = useState (locales[handleLocale()]) // handle the non-tr,en locales
  useEffect (() => {
    if (locale){
      setLocale (locale)
      setLocaleInUse (locales[locale])
      getLocaleFromStorage ()
    }
  }, [locale])

  const getLocaleFromStorage = async () => {
    let locale = await AsyncStorage.getItem ('@locale')
    if (locale){
      setLocale (locale)
      setLocaleInUse (locales[locale])
    }
  }

  useEffect  (() => {
   setLocale (OSLocale)

    registerForPushNotificationsAsync ()
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse)

    return () => {
      if (responseListener) {
        Notifications.removeNotificationSubscription(handleNotificationResponse)
      }
    }
  }, [])

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

  const PlaceStack = () => {
    return <Stack.Navigator initialRouteName="Place List" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Place Detay" component={PlaceScreen} />
      <Stack.Screen name="Place List" component={PlaceGroupsScreen} />
    </Stack.Navigator>
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props}>{
          useEffect  (() => {
            setRoutes (props.state.routeNames)
          }, [props.state.routeNames])
        }</CustomDrawer>} initialRouteName={localeInUse.homepage}>
        <Drawer.Screen options={options} name={localeInUse.homepage} component={HomeScreen} />
        <Drawer.Screen options={options} name={localeInUse.howto} component={HowtoStack} />
        <Drawer.Screen options={options} name={localeInUse.virtual_tour} component={TourScreen} />
        <Drawer.Screen options={options} name={localeInUse.places} component={PlaceStack} />
        <Drawer.Screen options={options} name={localeInUse.map} component={MapScreen} />
        <Drawer.Screen options={options} name={localeInUse.events} component={EventStack} />
        <Drawer.Screen options={options} name={localeInUse.email} component={MailScreen} />
        <Drawer.Screen options={options} name={localeInUse.directory} component={DirectoryScreen} />
        <Drawer.Screen options={options} name={localeInUse.report} component={ReportScreen} />
        <Drawer.Screen options={options} name={localeInUse.transportation} component={TransportationScreen} />
        <Drawer.Screen options={options} name={localeInUse.links} component={LinksScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const options={
  headerStyle: {
    backgroundColor: '#1D8D84',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}