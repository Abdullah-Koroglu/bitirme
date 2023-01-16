import { useContext, useEffect, useState, useCallback } from "react";
import { Alert, Linking, RefreshControl } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import { StateContext } from "../context/StateContext";
import { debounce } from "lodash";
import locales from '../locale'

export default function DirectoryScreen({ navigation }) {
  const [records, setRecords] = useState(null)
  const [searchText, setSearchText] = useState(null)
  const [searchResult, setSearchResult] = useState(null)
  const {locale} = useContext (StateContext)
  const [localeInUse, setLocaleInUse] = useState(locales[locale])
  const getRecords = async () => {
    try {
      const response = await axios.get('/contacts')
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

`
const ListItemHeader = styled.Text`
font-weight: 600;
font-size: 25px;
`

const ListItemText = styled.Text`
font-weight: 500;
text-overflow: ellipsis;
width: 5px;
`

const CommonContainer = styled.View`
padding: 10px;
background-color: #c5c5c5;
border-radius: 10px;
margin-bottom: 10px;
`

const SearchInput = styled.TextInput`
background-color: white;
border-radius: 3px;
padding: 4px 10px;
`
const SearchResult = styled.View`
margin-top: 10px;
`

const onSearchChanged = async(param) => {
  try {
    const response = await axios.get(`/contacts?filters[name][$containsi]=${param}&populate=*`)/*  */
    response.data?.data && setSearchResult (response.data.data)
  } catch (error) {
    console.error(error)
  }
}

const onSearchChangedDebounced = useCallback(debounce(onSearchChanged, 800), []);

const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(() => {
  setRefreshing(true);
  getRecords ()
  .then(() => setRefreshing(false));
}, []);

const handleCall = (record) => {
  Alert.alert(
    localeInUse.how_to_contact,'',
    [
      record.phone && {
        text: localeInUse.call,
        onPress: () => Linking.openURL (`tel:${record.phone}`),
        style: "cancel",
      },
      record.email && {
        text: localeInUse.send_mail,
        onPress: () => Linking.openURL (`mailto:${record.email}`)
      },
    ],
    {
      cancelable: true,
      userInterfaceStyle: 'dark'
    }
  );
}

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
              onPress={() => {handleCall (record?.attributes)}}
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
            return <ListItem
            key={record?.id}
            onPress={() => {handleCall (record?.attributes)}}
            >
              <ListItemRow>
                <ListItemHeader>{record?.attributes.name}</ListItemHeader>
              </ListItemRow>
              <ListItemRow>
              {
                record?.attributes.phone &&
                <ListItemText>
                  {record?.attributes.phone}
                </ListItemText>
              }
              </ListItemRow>
              <ListItemRow>
              {
                record?.attributes.email &&
                <ListItemText>
                  {record?.attributes.email}
                </ListItemText>
              }
              </ListItemRow>
            </ListItem>
          }
        )}
    </Container>
  );
}