import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import NaverMapView, { Marker } from 'react-native-nmap';
import { NativeBaseProvider, IconButton, Icon } from 'native-base';
import Font from 'react-native-vector-icons/FontAwesome';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
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

  let menu = [];
  const menuList = restData['menu'];
  if (menuList != undefined) {
    for (const [id, order] of Object.entries(menuList)) {
      const [food, price] = order.split(" : ")
      menu.push(
        <View style={style.menuView} key={id}>
          <Text style={{ fontWeight: "bold" }}>{food}</Text>
          <Text>{price}원</Text>
        </View>
      )
    }
  }

  let comments = [];
  const commentsList = restData['comments'];
  if (commentsList !== undefined) {
    for (const [id, comment] of Object.entries(commentsList)) {
      if (comment != null) {
        comments.push(
          <View style={style.commentsView} key={id}>
            <IconButton
              alignSelf="flex-end"
              size="sm"
              borderRadius="full"
              onPress={() => props.onPop(id, comment.query)}
              icon={<Icon name="trash-o" as={Font} size="sm" color="#713f12" />}
            />
            <Text style={style.commentsText}>맛 : {'★'.repeat(comment["맛"])}</Text>
            <Text style={style.commentsText}>가성비 : {'★'.repeat(comment["가성비"])}</Text>
            <Text style={style.commentsText}>서비스 : {'★'.repeat(comment["서비스"])}</Text>
            <Text style={style.commentsText}>종합 : {'★'.repeat(comment["종합"])}</Text>
            <Text style={style.commentsText}>총평 : {comment["총평"]}</Text>
            {comment["배달여부"] &&
              <Text style={style.commentsText}>
                배달 시간 : {comment["배달시간"]}분    배달비 : {comment["배달비"]}원
              </Text>
            }
            <Text style={{ textAlign: "right", color: "#4b4b4b" }}>{comment["작성시간"]}</Text>
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
            icon={<Icon name={tog1?"thumbs-up":"thumbs-o-up"} as={Font} size="sm" color="#30A9DE" />}
          />
          <IconButton
          onPress={() => setTog2(!tog2)}
          icon={
            <Icon name={tog2?"heart":"heart-o"} as={Font} size="sm" color="#f15c5c" />}
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
        <View style={[style.contexts, {marginBottom: 15}]}>
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
        <View style={[style.contexts, {marginBottom: 20}]}>
          <View style={style.titleView}>
            <Text style={style.keyText}>메뉴</Text>
          </View>
        </View>
          {menu}
      </View>
      <View style={[style.partition, style.endMargin]}>
        <View style={[style.contexts, {marginBottom: 15}]}>
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

  async function removeComment(commentId, queryId) {
    await restRef
      .child("comments/" + commentId.toString())
      .remove()
      .then(() => {
        firestore()
          .collection('가게')
          .doc(restData['official_name'])
          .collection('리뷰')
          .doc(queryId)
          .delete();
      });
    await restRef.update({
      comments_count: restData['comments_count'] - 1
    });
    setReload(true);
  }

  return (
    <SafeAreaView style={style.containter}>
      <NativeBaseProvider>
        <ScrollView>
          <RestComponent
            restData={restData}
            onPop={(id, query) => removeComment(id, query)}
          />
        </ScrollView>
        <CommentButton
          restName={restData['official_name']} 
          comments={restData['comments']}
          commentsCount={restData['comments_count']}
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
    backgroundColor: "#d1fae5"
  },
  contexts: {
    flexDirection: "row",
    marginVertical: 3,
  },
  keyText: {
    color: "#033326",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 3,
    marginHorizontal: 10
  },
  titleView: {
    backgroundColor: "#86efac",
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
    elevation: 8
  },
  horizontalLayout: {
    flexDirection: "row-reverse"
  },
  mapView: {
    width: '100%',
    aspectRatio: 1,
    borderColor: "#aaaaaa",
    borderWidth: 1
  },
  endMargin: {
    marginBottom: 100
  },
  menuView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#d1d1d1",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginHorizontal: 10
  },
  commentsView: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#65a30d",
    backgroundColor: "#d9f99d",
    width: "100%",
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 20
  },
  commentsText: {
    color: "#1c1917",
    fontSize: 14,
    marginVertical: 3
  }
})