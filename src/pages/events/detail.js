import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import moment from "moment";
import 'moment/locale/tr'
import Markdown from "react-native-markdown-renderer";
import { StateContext } from "../../context/StateContext";
import { Feather } from '@expo/vector-icons';

export default function EventsScreen({ route, navigation }) {
  const {eventId} = route.params
  const [record, setRecord] = useState(null)
  const {setPlaceQueue} = useContext (StateContext)

  const getRecord = async () => {
    try {
      const response = await axios.get(`/events/${eventId}?populate=*`)
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

const Container = styled.View`
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding: 15px;
  display: flex;
  gap: 10px;
`

const ListItemHeader = styled.Text`
font-weight: 700;
font-size: 30px;
padding-bottom: 10px;
`


  return (
    <Container>
      <ListItemHeader>
        {record?.attributes?.name}
      </ListItemHeader>
      <ListItemHeader style={{fontSize: 20}}>
        {moment (new Date(record?.attributes?.date)).format ('DD.MM.YYYY')}
      </ListItemHeader>
      <Markdown>
        {record?.attributes?.desc}
      </Markdown>
      {record?.attributes?.place?.data?.attributes &&
        <View style={{display: 'flex', flexDirection: "row"}}>
          <Feather name="map" size={24} color="black" />
          <Text style={{fontSize: 20, marginStart: 10}}>{record?.attributes?.place?.data?.attributes?.name}</Text>
        </View>
      }
    </Container>
  );
}