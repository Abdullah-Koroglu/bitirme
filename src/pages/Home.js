import { useContext} from "react";
import { StateContext } from "../context/StateContext";
import { View, Text, ScrollView } from "react-native";

import styled from 'styled-components/native';

export default function HomeScreen ({navigation}) {
  const [,,,,,routes] = useContext (StateContext)

  return (
      <Container style={{flexDirection: 'row', display : "flex"}}>
      {routes?.map (route => <Element onPress={() => {navigation.navigate (route)}}><ElementText>{route}</ElementText></Element>)}
      </Container>
  );
}

const Container = styled.View`
display: flex;
flex-wrap: wrap;
justify-content: center;
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