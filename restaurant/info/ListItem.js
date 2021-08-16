import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, ScrollView, SafeAreaView, RefreshControl, StyleSheet } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import { NativeBaseProvider, IconButton, Icon, Progress } from 'native-base';
import Font from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CommentButton from './CommentModal';
import MapScreen from './MapScreen';
import { InfoView, MenuListView, CommentListView, RatingBar } from './InfoElements';

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
      onMapClick={() => navigation.navigate("식당 위치", { name: props.restName, coordinate: props.position })}
    >
      <Marker coordinate={props.position} />
    </NaverMapView>
  )
}

const RestComponent = (props) => {
  const restData = props.restData;
  let menu = [];
  let comments = [];

  const menuList = restData['menu'];
  const commentsList = restData['comments'];

  if (menuList != undefined) {
    for (const [id, order] of Object.entries(menuList)) {
      menu.push(
        <MenuListView key={id} id={id} order={order} />
      )
    }
  }
  if (commentsList !== undefined) {
    for (const [id, comment] of Object.entries(commentsList)) {
      if (comment != null) {
        comments.push(
          <CommentListView key={id} id={id} comment={comment} onPop={props.onPop} />
        )
      }
    }
  }

  const [tog1, setTog1] = useState(false);
  const [tog2, setTog2] = useState(false);
  const navigation = useNavigation();
  return (
    <>
      <View style={style.partition}>
        <View style={style.horizontalLayout}>
          <IconButton
            onPress={() => setTog1(!tog1)}
            icon={<Icon name={tog1 ? "thumbs-up" : "thumbs-o-up"} as={Font} size="sm" color="#30A9DE" />}
          />
          <IconButton
            onPress={() => setTog2(!tog2)}
            icon={
              <Icon name={tog2 ? "heart" : "heart-o"} as={Font} size="sm" color="#f15c5c" />}
          />
          <IconButton
            onPress={() => navigation.navigate("같이 배달", {screen: "새로운 채팅방 만들기"})}
            icon={
              <Icon name="wechat" as={Font} size="sm" color="#4c1d95" />}
          />
        </View>
        <View>
          <InfoView
            keyText="이름"
            value={restData['official_name']}
          />
          <InfoView
            keyText="주소"
            value={restData['address']}
          />
          <InfoView
            keyText="번호"
            value={restData['contact']}
          />
        </View>
        <View>
          <RatingBar
            bgText="#67e8f9"
            ratingName="맛"
            ratingData={restData['flavor']}
            theme="cyan"
          />
          <RatingBar
            bgText="#67e8f9"
            ratingName="가성비"
            ratingData={restData['cost_performance']}
            theme="cyan"
          />
          <RatingBar
            bgText="#67e8f9"
            ratingName="서비스"
            ratingData={restData['service']}
            theme="cyan"
          />
          <RatingBar
            bgText="#fbbf24"
            ratingName="종합"
            ratingData={restData['overall']}
            theme="amber"
          />
          <View style={style.horizontalLayout}>
            <Text style={{ color: '#57534e', fontWeight: 'bold' }}>
              총 <Text style={{ color: '#292524' }}>{restData['comments_count']}</Text>명이 참여해주셨습니다.
            </Text>
          </View>
        </View>
      </View>
      <View style={style.partition}>
        <View style={[style.contexts, { marginBottom: 15 }]}>
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
        <View style={[style.contexts, { marginBottom: 20 }]}>
          <View style={style.titleView}>
            <Text style={style.keyText}>메뉴</Text>
          </View>
        </View>
        {menu}
      </View>
      <View style={[style.partition, style.endMargin]}>
        <View style={[style.contexts, { marginBottom: 15 }]}>
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
  const [refreshing, setRefreshing] = useState(false);
  const [restData, setData] = useState({});
  let restDir = '/식당/' + props.restId;
  const restRef = database().ref(restDir);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    restRef.once('value').then(data => {
      if (data) {
        setData(data.val());
      }
    });
    console.log(refreshing)
  }, [refreshing]);

  async function removeComment(commentId, queryId) {
    await restRef.child('comments/' + commentId.toString()).remove().then(() => {
      const commentsCount = restData['comments_count'];

      firestore().collection('가게').doc(restData['official_name']).collection('리뷰').doc(queryId).delete();
      if (commentsCount == 1) {
        restRef.update({
          comments_count: 0,
          flavor: 0,
          cost_performance: 0,
          service: 0,
          overall: 0
        }).then(onRefresh);
      } else {
        const comment = restData['comments'][commentId];
        restRef.update({
          comments_count: commentsCount - 1,
          flavor: (restData['flavor'] * commentsCount - comment['맛']) / (commentsCount - 1),
          cost_performance: (restData['cost_performance'] * commentsCount - comment['가성비']) / (commentsCount - 1),
          service: (restData['service'] * commentsCount - comment['서비스']) / (commentsCount - 1),
          overall: (restData['overall'] * commentsCount - comment['종합']) / (commentsCount - 1)
        }).then(onRefresh);
      }
    });
  }

  return (
    <SafeAreaView style={style.containter}>
      <NativeBaseProvider>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <RestComponent
            restData={restData}
            onPop={(id, query) => removeComment(id, query)}
          />
        </ScrollView>
        <CommentButton
          restaurantData={restData}
          commentsDir={restDir}
          onFinish={onRefresh}
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
    backgroundColor: '#d1fae5'
  },
  contexts: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  keyText: {
    color: '#033326',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 3,
    marginHorizontal: 10
  },
  titleView: {
    backgroundColor: '#86efac',
    borderRadius: 50,
    marginHorizontal: 5
  },
  partition: {
    borderRadius: 25,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    marginHorizontal: 15,
    paddingVertical: 20,
    paddingHorizontal: 30,
    shadowColor: '#666666',
    shadowRadius: 1,
    shadowOpacity: 0.3,
    elevation: 8
  },
  horizontalLayout: {
    flexDirection: 'row-reverse'
  },
  mapView: {
    width: '100%',
    aspectRatio: 1,
    borderColor: '#aaaaaa',
    borderWidth: 1
  },
  endMargin: {
    marginBottom: 100
  }
})