import { useContext, useEffect, useState} from "react";
import { StateContext } from "../context/StateContext";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import styled from 'styled-components/native';
import locales from "../locale";

export default function HomeScreen ({navigation}) {
  const {routes,setLocale,locale} = useContext (StateContext)
  const [editing, setEditing] = useState (false)
  const [favs, setFavs] = useState ([])

  useEffect (_ => {
    retrieveFavs ()
  }, [])

  const retrieveFavs = async() => {
    const result = await AsyncStorage.getItem ('favs')
    result && setFavs (result)
  }


  const handleLocale = async (locale) => {
    await AsyncStorage.setItem(
      '@locale',
      locale
    );
    setLocale (locale)
  }

  if (editing === false && locale) {
    return (
    <View style={{paddingVertical: 10, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
        <LocaleContainer>
          {
            Object.keys(locales).map (l => <LocaleElement onPress={() => handleLocale (l)} key={l} style={{backgroundColor: l === locale ? '#fff' : '#1D8D84'}}>
              <LocaleElementText style={{color: l === locale ? '#000' : '#fff'}}>{locales[l]?.locale}</LocaleElementText>
            </LocaleElement>)
          }
        </LocaleContainer>
      <Container style={{flexDirection: 'row', display : "flex"}}>
        {routes?.map (route => <Element key={route} onPress={() => {navigation.navigate (route)}}><ElementText>{route}</ElementText></Element>)}
        <Element onPress={() => {setEditing (true)}}><ElementText>{locales[locale]?.edit}</ElementText></Element>
      </Container>
    </View>);
  } else {
    return (
      <View style={{paddingVertical: 10, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
        <EditContainer>
          <Container style={{flexDirection: 'row', display : "flex"}}>
          {routes?.map (route => <Element key={route} onPress={() => {navigation.navigate (route)}}><ElementText>{route}</ElementText></Element>)}
          <Element onPress={() => setEditing (false)}><ElementText>{locales[locale]?.save}</ElementText></Element>
          </Container>
        </EditContainer>
        <Container style={{flexDirection: 'row', display : "flex"}}>
          {routes?.map (route => <Element key={route} onPress={() => {navigation.navigate (route)}}><ElementText>{route}</ElementText></Element>)}
          <Element onPress={() => setEditing (false)}><ElementText>{locales[locale]?.save}</ElementText></Element>
        </Container>
      </View>
    )
  }
}

const Container = styled.View`
display: flex;
flex-wrap: wrap;
justify-content: center;
`

const EditContainer = styled.View`
background-color: brown;
margin: 10px;
margin-top: 90px;
`

const LocaleContainer = styled.View`
background-color: #1D8D84;
display: flex;
flex-direction: row;
justify-content: center;
border-radius: 5px;
`

const LocaleElement = styled.TouchableOpacity`
align-self: flex-start;
padding: 10px 20px;
margin: 3px;
border-radius: 5px;
`

const LocaleElementText = styled.Text`
font-size: 20px;
`

const Element = styled.TouchableOpacity`
background-color: #1D8D84;
width: 150px;
height: 50px;
margin: 20px;
display: flex;
align-items: center;
justify-content: center;
border-radius: 5px;
`

const ElementText = styled.Text`
color: white;
`