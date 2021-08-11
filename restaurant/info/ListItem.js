import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet } from 'react-native'
import NaverMapView, { Marker } from 'react-native-nmap';
import { NativeBaseProvider } from 'native-base';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CommentButton from './CommentModal';
import MapScreen from './MapScreen';

const Stack = createNativeStackNavigator();

const MapView = (props) => {
  const navigation = useNavigation();

  if (props.position['latitude'] == undefined)
    return <View style={style.mapView} />

  return (
    <NaverMapView
      style={style.mapView}
      center={{ ...props.position, zoom: 18 }}
      compass={false}
      scaleBar={true}
      zoomControl={true}
      minZoomLevel={6}
      maxZoomLevel={19}
      onMapClick={() => {navigation.navigate("식당 위치", {name: props.restName, coordinate: props.position})}}
    >
      <Marker coordinate={props.position} />
    </NaverMapView>
  )
}

const RestComponent = (props) => {
  const restData = props.restData;

  let menu = '';
  if (restData['menu'] != undefined) {
    for (var menuList of restData['menu'])
      menu += menuList + '\n';
    menu = menu.substring(0, menu.length - 1)
  }

  return (
    <>
      <View style={style.partition}>
        <Text style={style.contexts}>
          <Text style={style.keyText}>이름 : </Text>
          {restData['official_name']}
        </Text>
        <Text style={style.contexts}>
					<Text style={style.keyText}>주소 : </Text>
					{restData['address']}
				</Text>
        <Text style={style.contexts}>
					<Text style={style.keyText}>번호 : </Text>
					{restData['contact']}
				</Text>
      </View>
      <View style={style.partition}>
        <Text style={style.contexts}>
          <Text style={style.keyText}>위치 정보</Text>
        </Text>
        <MapView
          restName={restData['official_name']}
          position={{ latitude: restData['y'], longitude: restData['x'] }}
        />
      </View>
      <View style={[style.partition, style.endMargin]}>
        <Text style={[style.keyText, {lineHeight: 40, fontSize: 16}]}>ᐧ 메뉴</Text>
        <Text style={{ paddingLeft: 20 }}>{menu}</Text>
      </View>
    </>
  );
}

const RestaurantInfo = (props) => {
  const [restData, setData] = useState({});
  let restDir = '/식당/' + props.restId;

  useEffect(() => {
    database().ref(restDir).once('value').then(data => {
      if (data) {
        setData(data.val());
      }
    });
    console.log(restData);
  }, []);
  console.log(restData);

  return (
    <SafeAreaView style={style.containter}>
      <NativeBaseProvider>
        <ScrollView>
          <RestComponent restData={restData} />
        </ScrollView>
        <CommentButton restName={restData['official_name']} />
      </NativeBaseProvider>
    </SafeAreaView>
  )
}

const ItemActivity = ({ route }) => {
  const RestInfo = () => {
    return <RestaurantInfo restId={route.params.restId} />
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="식당 정보 화면"
        component={RestInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="식당 위치"
        component={MapScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default ItemActivity;

const style = StyleSheet.create({
  containter: {
    height: '100%'
  },
  contexts: {
    lineHeight: 20
  },
  keyText: {
    fontWeight: 'bold',
  },
  partition: {
    borderWidth: 2,
    borderRadius: 25,
    margin: 5,
    paddingVertical: 20,
    paddingHorizontal: 30
  },
  mapView: {
    width: '100%',
    aspectRatio: 1
  },
  endMargin: {
    marginBottom: 100
  }
})