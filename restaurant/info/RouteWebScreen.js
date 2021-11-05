import React from 'react';
import WebView from 'react-native-webview';

const RouteWebScreen = ({ route }) => {
  console.log(route.params)
  const {name, coordinate, myPosition} = route.params;
  const restPath = `https://m.map.naver.com/route.nhn?menu=route&sname=내 위치&sx=${myPosition.latitude}&sy=${myPosition.longitude}&ename=${name}&ex=${coordinate.latitude}&ey=${coordinate.longitude}&pathType=0&showMap=true`;
  console.log(restPath)
  return (
    <WebView
      source={{ uri: restPath }}
    />
  )
}

export default RouteWebScreen;