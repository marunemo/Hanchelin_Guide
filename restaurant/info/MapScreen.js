import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';

const MapScreen = ({ navigation, route }) => {
  const [currentPosition, setPosition] = useState({ latitude: 36.103116, longitude: 129.388368 }); // Handong University
  const [centerPosition, setCenter] = useState(route.params.coordinate)
  const [zoomLevel, setZoom] = useState(16)
  // default zoom level of naver map is 16, and ratio is 1px : 1m when zoom level is 16.
  // ref : https://d2.naver.com/helloworld/1174
  // ref : https://www.ncloud.com/support/notice/all/738

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
    }

    Geolocation.getCurrentPosition(coordinate => {
      const { latitude, longitude } = coordinate.coords;
      setPosition({ latitude, longitude })
      setCenter({
        latitude: (currentPosition.latitude + route.params.coordinate.latitude) / 2,
        longitude: (currentPosition.longitude + route.params.coordinate.longitude) / 2
      })

      const maxAngle = Math.max(
        Math.abs(currentPosition.latitude - route.params.coordinate.latitude) / (Dimensions.get('screen').height),
        Math.abs(currentPosition.longitude - route.params.coordinate.longitude) / (Dimensions.get('screen').width)
      ) // max scale of angle per pixel
      const diffMeter = maxAngle / 360 * 2 * Math.PI * 6371000 // 2 * pi * earth radius(m) * (angle) / 360
      setZoom(16 - Math.log2(diffMeter) - 1) // reduce 1 level for padding
    }, error => {
      console.log(error.code, error.message);
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )

    navigation.setParams({ myPosition: { latitude: currentPosition.latitude, longitude: currentPosition.longitude }, ...route.params});
  }, [zoomLevel]);

  return (
    <NaverMapView
      style={styles.mapScreen}
      center={{ ...centerPosition, zoom: zoomLevel }}
      showsMyLocationButton={true}
      compass={false}
      scaleBar={true}
      zoomControl={false}
      minZoomLevel={6}
      maxZoomLevel={19}
    >
      <Marker
        coordinate={currentPosition}
        pinColor="blue"
        caption={{ text: '현위치' }}
      />
      <Marker
        coordinate={route.params.coordinate}
        caption={{ text: route.params.name }}
      />
    </NaverMapView>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  mapScreen: {
    width: '100%',
    height: '100%'
  }
})