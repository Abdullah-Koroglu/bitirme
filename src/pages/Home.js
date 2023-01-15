import { useContext, useEffect, useRef, useState} from "react";
import { StateContext } from "../context/StateContext";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import styled from 'styled-components/native';
import locales from "../locale";

export default function HomeScreen ({navigation}) {
  const {routes,setLocale,locale} = useContext (StateContext)
  const [editing, setEditing] = useState (false)
  const [favs, setFavs] = useState ([])
  const isMounted = useRef(false);

  useEffect (_ => {
    retrieveFavs ()
  }, [])

  const retrieveFavs = async () => {
    const result = await AsyncStorage.getItem ('@favs')
    result && setFavs (result.split (','))
  }

  const handleAddToFavs = async (route) => {
    setFavs ((prev) => [...prev, route])
  }

  const handleRemoveFromFavs = async (route) => {
    const newArr = favs.filter ((item) => item !== route)
    setFavs (newArr)
  }

  useEffect (() => {
    if (isMounted.current === false) {
      AsyncStorage.setItem(
        '@favs',
        favs.join (',')
      )
    }else {
      isMounted = true
    }
  }, [favs])

  const renderRoutes = (add, remove, edit) => {
    return (
      <Container style={{flexDirection: 'row', display : "flex"}}>
          {routes?.filter ((route) => favs.indexOf (route) >= 0).length ?
            <FavContainer>
              <ElementText style={{padding: 10, paddingTop: 20, paddingBottom: 0}}>{locales[locale]?.favorites}</ElementText>
              <Container style={{flexDirection: 'row', display : "flex"}}>
                {routes?.filter ((route) => favs.indexOf (route) >= 0)?.map (route =>
                  <Element key={route} onPress={() => {remove (route)}}><ElementText>{route}</ElementText></Element>
                )}
              </Container>
            </FavContainer>
          : null}
          {routes?.filter ((route) => favs.indexOf (route) < 0)?.map (route =>
            <Element key={route} onPress={() => {add (route)}}><ElementText>{route}</ElementText></Element>
          )}
          {edit ()}
        </Container>
    )
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
      <ScrollView>
        <View style={{paddingVertical: 10, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
          <LocaleContainer>
            {
              Object.keys(locales).map (l => <LocaleElement onPress={() => handleLocale (l)} key={l} style={{backgroundColor: l === locale ? '#fff' : '#1D8D84'}}>
                <LocaleElementText style={{color: l === locale ? '#000' : '#fff'}}>{locales[l]?.locale}</LocaleElementText>
              </LocaleElement>)
            }
          </LocaleContainer>
        {renderRoutes (
          (param) => navigation.navigate (param),
          (param) => navigation.navigate (param),
          () => <Element onPress={() => {setEditing (true)}}><ElementText>{locales[locale]?.edit}</ElementText></Element>
        )}
      </View>
    </ScrollView>
    );
  } else {
    return (
      <View style={{paddingVertical: 10, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
        {renderRoutes (
          (param) => handleAddToFavs (param),
          (param) => handleRemoveFromFavs (param),
          () => <Element onPress={() => setEditing (false)}><ElementText>{locales[locale]?.save}</ElementText></Element>
        )}
        {/* <FavContainer>
          <Container style={{flexDirection: 'row', display : "flex"}}>
            {favs?.length > 0 && routes?.filter ((route) => favs.indexOf (route) >= 0)?.map (route =>
              <Element key={route} onPress={() => {handleRemoveFromFavs (route)}}><ElementText>{route}</ElementText></Element>
            )}
          </Container>
        </FavContainer>
        <Container style={{flexDirection: 'row', display : "flex"}}>
          {routes?.filter ((route) => favs.indexOf (route) < 0)?.map (route => <Element key={route} onPress={() => {handleAddToFavs (route)}}><ElementText>{route}</ElementText></Element>)}
          <Element onPress={() => setEditing (false)}><ElementText>{locales[locale]?.save}</ElementText></Element>
        </Container> */}
      </View>
    )
  }
}

const Container = styled.View`
display: flex;
flex-wrap: wrap;
justify-content: center;
`

const FavContainer = styled.View`
background-color: #639995;
margin: 10px;
width: 100%;
display: flex;
flex-wrap: nowrap;
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