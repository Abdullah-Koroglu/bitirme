import * as React from 'react';
import {useEffect, useContext} from 'react';
import { StateContext } from "../context/StateContext";
import { Button, View, Text, Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications'

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
import { useNotifications } from '../hooks/useNotifications';
import { NativeModules } from 'react-native'
import { useState } from 'react';
import locales from '../locale'

const Drawer = createDrawerNavigator ();
const Stack = createNativeStackNavigator();

const handleLocale = (locale) => {
  if (locale === 'tr_TR' || locale === 'en_US') {
    return locale
  } else {
    return 'en_US'
  }
}

export default function App () {
  const [,,,,setRoutes,,setLocale] = useContext (StateContext)
  const { registerForPushNotificationsAsync, handleNotificationResponse } = useNotifications ()
  const locale = Platform.OS === 'android' ?
  NativeModules.I18nManager.localeIdentifier :
  NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]

  const [localeInUse, setLocaleInUse] = useState (locales[handleLocale(locale)]) // handle the non-tr,en locales

  useEffect  (() => {
   setLocale (locale)

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

  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}>{
          useEffect  (() => {
            setRoutes (props.state.routeNames)
          }, [])
  }</CustomDrawer>} initialRouteName={localeInUse.homepage}>
        <Drawer.Screen name={localeInUse.homepage} component={HomeScreen} />
        <Drawer.Screen name={localeInUse.howto} component={HowtoStack} />
        <Drawer.Screen name={localeInUse.virtual_tour} component={TourScreen} />
        <Drawer.Screen name={localeInUse.events} component={EventStack} />
        <Drawer.Screen name={localeInUse.email} component={MailScreen} />
        <Drawer.Screen name={localeInUse.directory} component={DirectoryScreen} />
        <Drawer.Screen name={localeInUse.report} component={ReportScreen} />
        <Drawer.Screen name={localeInUse.transportation} component={TransportationScreen} />
        <Drawer.Screen name={localeInUse.links} component={LinksScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}