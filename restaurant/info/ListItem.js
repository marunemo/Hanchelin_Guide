import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import { NativeBaseProvider, IconButton, Icon } from 'native-base';
import Font from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommentButton from './CommentModal';
import MapScreen from './MapScreen';

const Stack = createNativeStackNavigator();

const MapView = (props) => {
  const navigation = useNavigation();

  if (props.position['latitude'] == undefined) {
    return <View style={style.mapView} />;
	}

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

const InfoComponent = (props) => {
  return (
    <View style={style.contexts}>
      <View style={style.titleView}>
        <Text style={style.keyText}>
          {props.keyText}
        </Text>
      </View>
      <Text style={{ fontSize: 16, marginVertical: 3 }}>
        {props.value}
      </Text>
    </View>
  )
}

const RestComponent = (props) => {
  const restData = props.restData;

  let menu = '';
  if (restData['menu'] != undefined) {
    for (var menuList of restData['menu'])
      menu += menuList + '\n';
    menu = menu.substring(0, menu.length - 1);
  }

  let comments = [];
  const commentsList = restData['comments']
  if (commentsList !== undefined) {
    for (const [id, comment] of Object.entries(commentsList)) {
      if (comment != null) {
        comments.push(
          <View style={style.commentsView} key={id}>
            <IconButton
              style={{ alignSelf: "flex-end" }}
              onPress={() => props.onPop(id)}
              icon={<Icon name="trash-o" as={Font} size="xs" />}
            />
            <Text>맛 : {'★'.repeat(comment["맛"])}</Text>
            <Text>가성비 : {'★'.repeat(comment["가성비"])}</Text>
            <Text>서비스 : {'★'.repeat(comment["서비스"])}</Text>
            <Text>종합 : {'★'.repeat(comment["종합"])}</Text>
            <Text>총평 : {comment["총평"]}</Text>
            {comment["배달여부"] && <Text>배달 시간 : {comment["배달시간"]}분    배달비 : {comment["배달비"]}원</Text>}
            <Text style={{ textAlign: "right" }}>{comment["작성시간"]}</Text>
          </View>
        )
      }
    }
  }

  const [tog1, setTog1] = useState(false);
  const [tog2, setTog2] = useState(false);
  return (
    <>
      <View style={style.partition}>
        <View style={style.horizontalLayout}>
          <IconButton
            onPress={() => setTog1(!tog1)}
            icon={
              <Icon
                name={tog1?"thumbs-up":"thumbs-o-up"}
                as={Font}
                size="sm"
                color="#30A9DE"
              />
            }
          />
           <IconButton
            onPress={() => setTog2(!tog2)}
            icon={
              <Icon
                name={tog2?"heart":"heart-o"}
                as={Font}
                size="sm"
                color="#f15c5c"
              />
            }
          />
        </View>
        <View>
          <InfoComponent
            keyText="이름"
            value={restData['official_name']}
          />
          <InfoComponent
            keyText="주소"
            value={restData['address']}
          />
          <InfoComponent
            keyText="번호"
            value={restData['contact']}
          />
				</View>
      </View>
      <View style={style.partition}>
        <View style={style.contexts}>
          <View style={style.titleView}>
            <Text style={style.keyText}>위치 정보</Text>
          </View>
        </View>
        <MapView
          restName={restData['official_name']}
          position={{ latitude: restData['y'], longitude: restData['x'] }}
        />
      </View>
      <View style={style.partition}>
        <View style={style.contexts}>
          <View style={style.titleView}>
            <Text style={style.keyText}>메뉴</Text>
          </View>
        </View>
        <Text style={{ paddingLeft: 20 }}>{menu}</Text>
      </View>
      <View style={[style.partition, style.endMargin]}>
        <View style={style.contexts}>
          <View style={style.titleView}>
            <Text style={style.keyText}>댓글</Text>
          </View>
        </View>
        {comments}
      </View>
    </>
  );
}

const RestaurantInfo = (props) => {
  const [reload, setReload] = useState(false);
  const [restData, setData] = useState({});
  let restDir = '/식당/' + props.restId;
  const restRef = database().ref(restDir);

  useEffect(() => {
    restRef.once('value').then(data => {
      if (data) {
        setData(data.val());
      }
    });
    setReload(false);
  }, [reload]);

  async function removeComment(commentId) {
    await restRef.child("comments/" + commentId.toString()).remove();
    setReload(true);
  }

  return (
    <SafeAreaView style={style.containter}>
      <NativeBaseProvider>
        <ScrollView>
          <RestComponent
            restData={restData}
            onPop={id => removeComment(id)}
          />
        </ScrollView>
        <CommentButton
          restName={restData['official_name']} 
          comments={restData['comments']}
          commentsDir={restDir}
          onFinish={update => setReload(update)}
        />
      </NativeBaseProvider>
    </SafeAreaView>
  )
}

const ItemActivity = ({ route }) => {
  const RestInfo = () => {
    return <RestaurantInfo restId={route.params.restId} />;
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
  );
}

export default ItemActivity;

const style = StyleSheet.create({
  containter: {
    height: '100%',
    backgroundColor: "#d1ffe9"
  },
  contexts: {
    flexDirection: "row",
    marginVertical: 3,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 3,
    marginHorizontal: 10
  },
  titleView: {
    backgroundColor: "#7eed9a",
    borderRadius: 50,
    marginHorizontal: 5
  },
  partition: {
    borderRadius: 25,
    backgroundColor: "#ffffff",
    marginVertical: 5,
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: '#666666',
    shadowRadius: 1,
    shadowOpacity: 0.3,
  },
  horizontalLayout: {
    flexDirection: "row-reverse"
  },
  mapView: {
    width: '100%',
    aspectRatio: 1
  },
  endMargin: {
    marginBottom: 100
  },
  commentsView: {
    borderWidth: 1,
    borderColor: "#75a64a",
    width: "100%",
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 20
  }
})