import React from 'react';
import WebView from 'react-native-webview';

const RouteWebScreen = ({ route }) => {
  const {name, coordinate} = route.params;
  const restPath = `https://m.map.naver.com/route.nhn?menu=route&ename=${'가온밀면'}&ex=${coordinate.latitude}&ey=${coordinate.longitude}&pathType=0&showMap=true`;
  return (
    <WebView
      source={{ uri: restPath }}
    />
  )
}

export default RouteWebScreen;