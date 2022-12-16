import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import moment from "moment";
import 'moment/locale/tr'
import Markdown from "react-native-markdown-renderer";
import { StateContext } from "../context/StateContext";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import locales from '../locale'

export default function PlaceScreen({ navigation }) {
  const [,,,,,,,locale,setPlaceQueue,placeQueue] = useContext (StateContext)
  const [localeInUse, setLocaleInUse] = useState(locales[locale])
  const [record, setRecord] = useState(null)
  const [children, setChildren] = useState(null)

  const getRecord = async () => {
    try {
      const placeId = placeQueue[placeQueue.length -1]
      const response = await axios.get(`/places/${placeId}?populate=*`)
      const childrenResponse = await axios.get(`/places?filters[parent][id][$eq]=${placeId}`)
      response.data?.data && setRecord(response.data.data)
      childrenResponse.data?.data && setChildren(childrenResponse.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect (_ => {
    navigation.getParent ().setOptions ({
      headerRight: () => (
        <HeaderButtonContainer onPress={() => handleNavigate ()}><Feather name="map" size={24} color="white" /></HeaderButtonContainer>
      ),
    })
  }, [navigation, record])

  useEffect(
    () => {
      getRecord()
    },
    []
  )

const HeaderButtonContainer = styled.TouchableOpacity`
margin-right: 20px;
`

const Container = styled.ScrollView`
  flex: 1;
  display: flex;
  padding: 15px;
  display: flex;
  gap: 10px;
`

const ListItemHeader = styled.Text`
font-weight: 700;
font-size: 30px;
padding-bottom: 10px;
margin-bottom: 2px;
`

const ChildrenContainer = styled.View`
padding-bottom: 50px;
padding-top: 20;
`

const ChildrenElementText = styled.Text`
font-size: 20px;
padding-bottom: 5px;
`

const BackContainer = styled.TouchableOpacity`
padding-right: 10px;
`

const handleNavigate = () => {
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
        media: record.attributes.media.data[0]?.attributes?.url
      }
      )
  } else {
    console.log ('error')
  }
}

  return (
    <Container>
      <ListItemHeader>
        {placeQueue?.length > 1 &&
          <BackContainer onPress={() => {setRecord (null); setPlaceQueue (placeQueue.slice (0, -1)); getRecord ()}}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </BackContainer>
        }
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
      {
        children?.length > 0 &&
        <ChildrenContainer>
          <ListItemHeader>
            {localeInUse.components}
          </ListItemHeader>
          {children?.map (child => <TouchableOpacity onPress={() => {setPlaceQueue ([...placeQueue, child.id])}}><ChildrenElementText>● {child.attributes.name}</ChildrenElementText></TouchableOpacity>)}
        </ChildrenContainer>
      }
    </Container>
  );
}