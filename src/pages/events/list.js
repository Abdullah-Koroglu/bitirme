import { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import moment from "moment";
import { StateContext } from "../../context/StateContext";
import 'moment/locale/tr'

export default function EventsScreen({ navigation }) {
  const [records, setRecords] = useState(null)
  const [setEventId] = useContext (StateContext)
  const getRecords = async () => {
    try {
      const response = await axios.get('/events')
      response.data?.data && setRecords(response.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(
    () => {
      getRecords()
    },
    []
  )

  const Container = styled.View`
  flex: 1;
  display: flex;
  align-items: flex-start;
  padding: 15px;
`

const ListItem = styled.TouchableOpacity`
background-color: white;
padding: 10px;
border-radius: 12px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
width: 100%;
margin-bottom: 10px;
`
const ListItemRow = styled.Text`
display: flex;
text-overflow: ellipsis;

`

const ListItemText = styled.Text`
font-weight: 500;
text-overflow: ellipsis;
width: 5px;
`

const ListItemHeader = styled.Text`
font-weight: 700;
font-size: 30px;
`

const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(() => {
  setRefreshing(true);
  getRecords ()
  .then(() => setRefreshing(false));
}, []);

  return (
    <Container
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
    >
      {records?.map(
        (record) => {
          var date = moment(record?.attributes?.date);
          date.locale('tr')
          return <ListItem key={record?.id} onPress={() => {setEventId (record?.id) ;navigation.navigate ('Etkinlikler Detay')}}>
            <ListItemRow>
              <ListItemHeader>{record?.attributes.name}</ListItemHeader>
            </ListItemRow>
            <ListItemRow>
              <ListItemText>{date.format('Do MMMM YYYY')}</ListItemText>
            </ListItemRow>
          </ListItem>
        }
      )}
    </Container>
  );
}