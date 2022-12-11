import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { StateProvider } from './src/context/StateContext';
import { ToastProvider } from 'react-native-toast-notifications'
import Drawer from './src/drawer/index'
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL
axios.defaults.headers.common.Authorization = `Bearer baf31f4d5b4d33184f90d0b126341b55902bed16013fda73f8692376ae63fb70ca3c04683dfedf41e27ac5180cc0c4bb2a5a1fbd7eda1070e74f5e62a783dbb3e5eca67698304c59cd323a79b624c6712db89cfd7812b7d9e584ac7bab04cad71791b818a1a3329597f75ff77507219585a1778ab6e0d76681a051a05485ef1a`
// axios.defaults.headers.common.Authorization = `Bearer baf31f4d5b4d33184f90d0b126341b55902bed16013fda73f8692376ae63fb70ca3c04683dfedf41e27ac5180cc0c4bb2a5a1fbd7eda1070e74f5e62a783dbb3e5eca67698304c59cd323a79b624c6712db89cfd7812b7d9e584ac7bab04cad71791b818a1a3329597f75ff77507219585a1778ab6e0d76681a051a05485ef1a${process.env.REACT_APP_API_TOKEN}`

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