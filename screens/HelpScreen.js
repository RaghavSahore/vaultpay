import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { WebView } from "react-native-webview";
// import { Button } from "react-native/types_generated/index";

export default function HelpScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Help Screen</Text>
      <WebView
        originWhitelist={["*"]} // 🐛 loads ANY origin
        source={{ uri: "https://example.com" }}
        javaScriptEnabled={true}
        onMessage={(e) => {
          eval(e.nativeEvent.data); // 🐛 runs whatever the page sends
        }}
        style={styles.webview} 
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
