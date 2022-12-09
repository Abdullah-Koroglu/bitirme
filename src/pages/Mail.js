import { View, Dimensions } from "react-native";
import { WebView } from 'react-native-webview';

export default function HomeScreen ({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <Text>http://mail.ogr.uludag.edu.tr</Text> */}
      <WebView
          scalesPageToFit={true}
          bounces={false}
          javaScriptEnabled
          style={{ height: 300, width: Dimensions.get("window").width }}
          source={{uri: "http://mail.ogr.uludag.edu.tr"}}
          automaticallyAdjustContentInsets={false}
        />
    </View>
  );
}