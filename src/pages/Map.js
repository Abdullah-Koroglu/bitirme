import { View, Text } from "react-native";
import MapView from 'react-native-maps';

export default function MapScreen ({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MapView style={{width:'100%', height:'100%'}} />
    </View>
  );
}