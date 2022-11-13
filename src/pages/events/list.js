import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";

export default function EventsScreen ({ navigation }) {
  const [records, setRecords] = useState(null)
  const getRecords = async() => {
    try {
      const response = await axios.get('/events')
      response.data?.data && setRecords (response.data.data)
    } catch (error) {
        console.error (error)
    }
  }

  useEffect (
    () => {
      getRecords ()
    },
    []
  )
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Events Page</Text>
      {records?.map ((record) => <Text>{record?.attributes.name}</Text> )}
    </View>
  );
}