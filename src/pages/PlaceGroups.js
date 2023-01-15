import { useContext, useEffect, useState, useCallback } from "react";
import { Alert, Linking, RefreshControl, Text } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { StateContext } from "../context/StateContext";
import locales from '../locale'
import { debounce } from "lodash";

export default function PlaceGroupScreen({ navigation, route }) {
  const [records, setRecords] = useState(null)
  const [recordsType, setRecordsType] = useState(null)
  const {locale,setPlaceQueue} = useContext (StateContext)
  const [searchResult, setSearchResult] = useState(null)
  const [localeInUse] = useState(locales[locale])
  const getRecords = async (groupId) => {
    try {
      const requestLink = groupId ? `/places?filters[placeGroup][id][$eq]=${groupId}` : '/place-groups'
      const response = await axios.get(requestLink)
      response.data?.data && setRecords(response.data.data)
      !groupId && setRecordsType ('place-groups')
      recordsType === 'place-groups' && setRecordsType ('places')
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

const BackContainer = styled.TouchableOpacity`
margin: 10px;
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
display: flex;
flex-direction: column;
justify-content: center;
`
const ListItemRow = styled.Text`
display: flex;
flex: 1;
justify-content: center;
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


const handleNavigation = (record, force) => {
  if (recordsType === 'place-groups' && !force) {
    getRecords (record?.id)
  }else {
    navigation.navigate ('Place Detay')
    setPlaceQueue ([record?.id])
  }
}


const onSearchChanged = async(param) => {
  try {
    const response = await axios.get(`/places?filters[name][$containsi]=${param}&populate=*`)/*  */
    response.data?.data && setSearchResult (response.data.data)
  } catch (error) {
    console.error(error)
  }
}

const onSearchChangedDebounced = useCallback(debounce(onSearchChanged, 800), []);

  return (
    <Container>
      <CommonContainer>
        <SearchInput placeholder={localeInUse.search} onChangeText={onSearchChangedDebounced}/>
        {searchResult?.length > 0 && <SearchResult>
          {searchResult?.map(
            (record) => {
              return <ListItem
              key={record?.id}
              onPress={() => {handleNavigation (record, true)}}
              >
                <ListItemRow>
                  <ListItemHeader>{record?.attributes.name}</ListItemHeader>
                </ListItemRow>
              </ListItem>
            }
          )}
        </SearchResult>}
      </CommonContainer>



        {recordsType === 'places' &&
          <BackContainer onPress={() => {setRecords (null); setRecordsType (null); getRecords ()}}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </BackContainer>
        }
        {(records?.length === 0) && <ListItemHeader>{localeInUse.no_record}</ListItemHeader> }
        {records?.map(
          (record) => {
            return <ListItem
            key={record?.id}
            onPress={() => {handleNavigation (record)}}
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