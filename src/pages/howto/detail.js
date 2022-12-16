import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import moment from "moment";
import 'moment/locale/tr'
import Markdown from "react-native-markdown-renderer";
import { StateContext } from "../../context/StateContext";


export default function HowtosScreen({ navigation }) {
  const [,,,howtoId] = useContext (StateContext)
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
      {record?.attributes && <Image
      style={{
        width: Dimensions.get("window").width * 0.9,
        aspectRatio: record?.attributes?.media?.data?.[0]?.attributes?.width / record?.attributes?.media?.data?.[0]?.attributes?.height}}
      source={{uri: process.env.REACT_APP_IMAGE_URL + record?.attributes?.media?.data?.[0]?.attributes?.url}}
      />}
      <Markdown>
        {record?.attributes?.desc}
      </Markdown>
    </Container>
  );
}