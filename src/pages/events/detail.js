import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import moment from "moment";
import 'moment/locale/tr'
import Markdown from "react-native-markdown-renderer";
import { StateContext } from "../../context/StateContext";


export default function EventsScreen({ route, navigation }) {
  const {eventId} = route.params
  console.log (eventId)
  const [record, setRecord] = useState(null)

  const getRecord = async () => {
    try {
      const response = await axios.get(`/events/${eventId}`)
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
      <Markdown>
        {record?.attributes?.desc}
      </Markdown>
    </Container>
  );
}