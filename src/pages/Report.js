import { useState, useContext } from "react";
import axios from "axios";
import { View, Text, Dimensions, Alert } from "react-native";
import styled from 'styled-components/native';
import { useToast } from "react-native-toast-notifications";
import { StateContext } from "../context/StateContext";
import locales from "../locale";

export default function HomeScreen ({ navigation }) {
  const {locale} = useContext (StateContext)
  const toast = useToast();

  const [topic, setTopic] = useState ()
  const [desc, setDesc] = useState ()
  const [localeInUse] = useState (locales[locale])

  const createRecord = async () => {
    try {
      if (topic && desc) {
        await axios.post(`/reports`, {data: {topic,desc}})
        toast.show ('İsteğiniz iletildi',{animationType: 'zoom-in', type: "success"})
        setTopic ()
        setDesc ()
      } else {
        toast.show ('Lütfen alanları doldurunuz.',{animationType: 'zoom-in', type: "danger"})
      }
    } catch (error) {
      toast.show ('İsteğiniz iletilemedi',{animationType: 'zoom-in', type: "danger"})
      console.error(error)
    }
  }

  return (
    <View style={{ flex: 1}}>
      <Container style={{width: Dimensions.get("window").width}}>
        <Row>
          <InputHeader>{localeInUse.topic}</InputHeader>
          <Input value={topic} onChangeText={e => setTopic (e)} maxLength={50} />
        </Row>
        <View style={{marginBottom: 20}}>
          <InputHeader style={{marginBottom: 10}}>{localeInUse.desc}</InputHeader>
          <Input style={{textAlignVertical: 'top'}} value={desc} onChangeText={setDesc} multiline={true} numberOfLines={10}/>
        </View>
        <Submit color="#1D8D84" title={localeInUse.send} onPress={() => {createRecord ()}}></Submit>
      </Container>
    </View>
  );
}

const Container = styled.ScrollView`
/* background-color: black; */
flex: 1;
padding: 20px;
`
const Row = styled.View`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
margin-bottom: 20px;
`

const InputHeader = styled.Text`
margin-right: 10px;
font-weight: 600;
font-size: 19px;
`

const Input = styled.TextInput`
background-color: white;
border: 1px solid #cdcdcd;
flex: 1;
border-radius: 5px;
padding: 5px 10px;
`

const Submit = styled.Button`
background-color: #1D8D84;
`