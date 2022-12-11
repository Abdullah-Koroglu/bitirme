import { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, RefreshControl, Linking } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import moment from "moment";
import { StateContext } from "../context/StateContext";
import 'moment/locale/tr'
import { debounce } from "lodash";
import locales from '../locale'

export default function HowtosScreen({ navigation }) {
  const [records, setRecords] = useState(null)
  const [searchText, setSearchText] = useState(null)
  const [searchResult, setSearchResult] = useState(null)
  const [,,setHowtoId,,,,,locale] = useContext (StateContext)
  const [localeInUse, setLocaleInUse] = useState(locales[locale])
  const getRecords = async () => {
    try {
      const response = await axios.get('/links')
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

const Container = styled.ScrollView`
flex: 1;
display: flex;
/* align-items: flex-start; */
padding: 15px;
`

const ListItem = styled.TouchableOpacity`
margin-bottom: 10px;
background-color: white;
padding: 10px;
border-radius: 12px;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
width: 100%;
`
const ListItemRow = styled.Text`
display: flex;
text-overflow: ellipsis;
padding: 5px 20px;
`

const ListItemHeader = styled.Text`
font-weight: 600;
font-size: 25px;
`

// const [refreshing, setRefreshing] = useState(false);

// const onRefresh = useCallback(() => {
//   setRefreshing(true);
//   getRecords ()
//   .then(() => setRefreshing(false));
// }, []);

const handleClick = (url) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  });
};

  return (
    <Container
    // refreshControl={
    //   <RefreshControl
    //     refreshing={refreshing}
    //     onRefresh={onRefresh}
    //   />
    // }
    >
        {records?.map(
          (record) => {
            return <ListItem
            key={record?.id}
            onPress={() => { handleClick (record?.attributes.link)}}
            >
              <ListItemRow>
                <ListItemHeader>{record?.attributes.name}</ListItemHeader>
              </ListItemRow>
            </ListItem>
          }
        )}
    </Container>
  );
}