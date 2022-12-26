import { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import { debounce } from "lodash";
import moment from "moment";
import { StateContext } from "../../context/StateContext";
import 'moment/locale/tr'
import locales from '../../locale'

export default function EventsScreen({ navigation }) {
  const [records, setRecords] = useState(null)
  const [setEventId,,,,,,,locale] = useContext (StateContext)
  const [searchResult, setSearchResult] = useState(null)
  const [localeInUse, setLocaleInUse] = useState(locales[locale])

  const getRecords = async () => {
    try {
      const response = await axios.get('/events') // bugunden sonraki eventleri filtrele
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

const CommonContainer = styled.View`
padding: 10px;
background-color: #c5c5c5;
border-radius: 10px;
margin-bottom: 10px;
width: 100%;
`

const SearchInput = styled.TextInput`
background-color: white;
border-radius: 3px;
padding: 4px 10px;
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

const SearchResult = styled.View`
margin-top: 10px;
`

const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(() => {
  setRefreshing(true);
  getRecords ()
  .then(() => setRefreshing(false));
}, []);

const onSearchChanged = async(param) => {
  try {
    const response = await axios.get(`/events?filters[name][$containsi]=${param}&populate=*`)
    response.data?.data && setSearchResult (response.data.data)
  } catch (error) {
    console.error(error)
  }
}

const onSearchChangedDebounced = useCallback(debounce(onSearchChanged, 800), []);

  return (
    <Container
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
    >
      <CommonContainer>
        <SearchInput placeholder={localeInUse.search} onChangeText={onSearchChangedDebounced}/>
        {searchResult?.length > 0 && <SearchResult>
          {searchResult?.map(
            (record) => {
              return <ListItem
              key={record?.id}
              onPress={() => {navigation.navigate ('Etkinlikler Detay', {eventId: record?.id})}}
              >
                <ListItemRow>
                  <ListItemHeader>{record?.attributes.name}</ListItemHeader>
                </ListItemRow>
              </ListItem>
            }
          )}
        </SearchResult>}
      </CommonContainer>

      {records?.map(
        (record) => {
          var date = moment(record?.attributes?.date);
          date.locale('tr')
          return <ListItem key={record?.id} onPress={() => {navigation.navigate ('Etkinlikler Detay', {eventId: record?.id})}}>
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