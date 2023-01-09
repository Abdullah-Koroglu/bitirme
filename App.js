import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { StateProvider } from './src/context/StateContext';
import { ToastProvider } from 'react-native-toast-notifications'
import Drawer from './src/drawer/index'
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
axios.defaults.headers.common.Authorization = `Bearer ${process.env.REACT_APP_API_TOKEN}`

export default function App () {
  return (
    <ToastProvider>
      <StateProvider>
          <Drawer />
          <StatusBar style="auto" />
      </StateProvider>
    </ToastProvider>
  );
};