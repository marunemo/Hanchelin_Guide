import React from 'react';
import WebView from 'react-native-webview';

const RouteWebScreen = ({ route }) => {
  console.log(route.params)
  return (
    <WebView
      source={{ uri: 'https://www.google.com' }}
    />
  )
}

export default RouteWebScreen;