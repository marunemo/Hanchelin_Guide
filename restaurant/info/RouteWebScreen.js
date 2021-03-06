import React from 'react';
import WebView from 'react-native-webview';

const RouteWebScreen = ({ route }) => {
  const { name, coordinate, myPosition } = route.params;
  const restPath = `https://m.map.naver.com/route.nhn?menu=route&sname=내 위치&sx=${myPosition.longitude}&sy=${myPosition.latitude}&ename=${name}&ex=${coordinate.longitude}&ey=${coordinate.latitude}&pathType=1&showMap=true`;
  return (
    <WebView
      onShouldStartLoadWithRequest={() => true}
      source={{ uri: restPath }}
    />
  )
}

export default RouteWebScreen;