import { useContext, useEffect, useState, useCallback } from "react";
import { Alert, Linking, RefreshControl, Text } from "react-native";
import axios from "axios";
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

import { StateContext } from "../context/StateContext";
import locales from '../locale'

export default function HowtosScreen({ navigation, route }) {
  const [records, setRecords] = useState(null)
  const [recordsType, setRecordsType] = useState(null)
  const [searchResult, setSearchResult] = useState(null)
  const {setHowtoId,locale,setPlaceQueue} = useContext (StateContext)
  const [localeInUse, setLocaleInUse] = useState(locales[locale])
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

const handleNavigation = (record) => {
  if (recordsType === 'place-groups') {
    getRecords (record?.id)
  }else {
    navigation.navigate ('Place Detay')
    setPlaceQueue ([record?.id])
  }
}


  return (
    <Container>
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