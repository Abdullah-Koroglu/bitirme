import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import moment from "moment";
import 'moment/locale/tr'
import { StateContext } from "../../context/StateContext";
import { Feather } from '@expo/vector-icons';
import Markdown from "react-native-markdown-renderer";
import locales from '../../locale'


export default function HowtosScreen({ navigation }) {
  const [,,,howtoId,,,,locale] = useContext (StateContext)
  const [localeInUse, setLocaleInUse] = useState(locales[locale])
  const [record, setRecord] = useState(null)

  const getRecord = async () => {
    try {
      const response = await axios.get(`/how-tos/${howtoId}?populate=*`)
      response.data?.data && setRecord(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(
    () => {
      getRecord()
    },
    []
  )

const Container = styled.ScrollView`
  flex: 1;
  display: flex;
  padding: 15px;
  display: flex;
  padding-bottom: 50px;
`

const Gaper = styled.View`
height: 20px;
`

const ListItemHeader = styled.Text`
font-weight: 700;
font-size: 30px;
padding-bottom: 10px;
`

const PlaceContainer = styled.TouchableOpacity`
padding: 15px;
margin-bottom: 10px;
display: flex;
justify-content: flex-start;
align-items: space-around;
flex-direction: row;
`

const handleNavigate = (record) => {
  if (record) {
    let location = record.attributes.location?.split (',');
    location = location.map (i => i.trim ())
    navigation.navigate (localeInUse.map,
      {
        location: {
          'latitude': parseFloat(location[0]),
          'longitude': parseFloat(location[1])
        },
        title: record.attributes.name,
        media: record.attributes.media?.data[0]?.attributes?.url
      }
      )
  } else {
    console.log ('error')
  }
}

  return (
    <Container>
      <ListItemHeader>
        {record?.attributes?.name}
      </ListItemHeader>
      {record?.attributes && <Image
      style={{
        width: Dimensions.get("window").width * 0.9,
        aspectRatio: record?.attributes?.media?.data?.[0]?.attributes?.width / record?.attributes?.media?.data?.[0]?.attributes?.height}}
      source={{uri: process.env.REACT_APP_IMAGE_URL + record?.attributes?.media?.data?.[0]?.attributes?.url}}
      />}
      <Markdown>
        {record?.attributes?.desc}
      </Markdown>
      {record?.attributes?.places && record?.attributes?.places?.data?.map (place => <PlaceContainer onPress={() => {handleNavigate (place)}}>
        <Feather style={{marginRight: 10}} name="map" size={12} color="black" /><Text>{place.attributes.name}</Text>
      </PlaceContainer>)}
      <Gaper/>
    </Container>
  );
}