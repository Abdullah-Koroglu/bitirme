import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { StateProvider } from './src/context/StateContext';
import Drawer from './src/drawer/index'


export default function App () {
  return (
    <StateProvider>
        <Drawer />
        <StatusBar style="auto" />
    </StateProvider>
  );
};