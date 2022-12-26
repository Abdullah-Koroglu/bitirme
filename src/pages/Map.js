import { useEffect } from "react";
import { View, Text, Dimensions, Button } from "react-native";
import MapView , {Marker} from 'react-native-maps';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('screen')
const latitudeDelta = 0.02522
const longitudeDelta = latitudeDelta * (width / height)
export default function MapScreen ({ navigation, route }) {
const marker = route.params

const ImageContainer = styled.View`

`

const Image = styled.Image`
border-radius: 50px;
outline:1px solid black;
border: 2px solid black;
`
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {marker && <MapView style={{width:'100%', height:'100%'}}
      initialRegion={{
        'latitude': 40.22668128520942,
        'longitude': 28.876643045484236,
        latitudeDelta,
        longitudeDelta,
      }}>
        {
          marker && <Marker
          coordinate={{...marker.location}}
          title={marker.title}
          stopPropagation={true}
          >
            {marker.media && <ImageContainer>
              <Image source={{uri: process.env.REACT_APP_IMAGE_URL + marker.media}} style={{height: 60, width:60 }} />
            </ImageContainer>}
          </Marker>
        }
      </MapView>}
    </View>
  );
}