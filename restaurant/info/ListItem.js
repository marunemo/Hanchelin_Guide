import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image } from "native-base";
import { View, SafeAreaView, RefreshControl, StyleSheet, Dimensions, Animated, TouchableHighlight } from 'react-native';
import Text from '../../defaultSetting/FontText';
// import Animated from 'react-native-reanimated';
import NaverMapView, { Marker } from 'react-native-nmap';
import { Rating } from 'react-native-ratings';
import { NativeBaseProvider, HStack, Center, Button, useToast } from 'native-base';
import Font from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import KakaoShareLink from 'react-native-kakao-share-link';

import CommentButton from './CommentModal';
import MapScreen from './MapScreen';
import RouteWebScreen from './RouteWebScreen';
import { KeyTextView, InfoView, MenuListView, CommentListView, RatingBar, InfoModal } from './InfoElements';

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
      <Marker
        coordinate={props.position}
        caption={{ text: props.restName }}
      />
    </NaverMapView>
  )
}

const RestComponent = (props) => {
  const [tog, setTog] = useState(false);
  const [showOpenHour, setShowOpenHour] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();
  const user = auth().currentUser;
  const restData = props.restData;
  const menuList = restData['menu'];
  const commentsList = restData['comments'];
  const openingHour = restData['hour_of_operation'];
  let menu = [];
  let comments = [];

  if (typeof (menuList) === 'object') {
    for (const [id, order] of Object.entries(menuList)) {
      menu.push(
        <MenuListView key={id} order={order} />
      )
    }
  } else if (typeof (menuList) === 'string') {
    menu = <MenuListView order={menuList} />
  }

  if (commentsList !== undefined) {
    for (const [id, comment] of Object.entries(commentsList)) {
      if (comment != null) {
        comments.push(
          <CommentListView key={id} user={user} id={id} comment={comment} onPop={props.onPop} />
        )
      }
    }
  }

  function openingParse(breaktime, weekday = -1) {
    if (breaktime === undefined)
      return '연중무휴';

    if (breaktime.onlyBreak)
      return breaktime.breakDate;

    const week = '일월화수목금토';
    let operationHour = '';
    if (weekday !== -1) {
      if (breaktime[week[weekday]] === undefined) {
        operationHour = '휴무';
      } else {
        let openingHours = [];
        for (const section of breaktime[week[weekday]]) {
          openingHours.push(section[0] + ' ~ ' + section[1]);
        }
        operationHour = openingHours.join(', ');
      }
    } else {
      let sortDay = [];
      for (const day of week) {
        if (breaktime[day] === undefined) {
          operationHour = day + ': 휴무';
        } else {
          let openingHours = [];
          for (const section of breaktime[day]) {
            openingHours.push(section[0] + ' ~ ' + section[1]);
          }
          operationHour = day + ": " + openingHours.join(', ');
        }
        sortDay.push(operationHour)
      }
      sortDay.push(sortDay.shift());
      operationHour = sortDay.join('\n');
    }

    if (breaktime.breakDate)
      operationHour += '\n' + breaktime.breakDate;
    return operationHour;
  }

  function isRestOpen(breaktime) {
    if (breaktime === undefined)
      return '영업중';
    const week = '일월화수목금토';
    const today = new Date();
    const weekToday = today.getDay();
    const todayDate = today.getDate();
    const todayHour = today.getHours();
    const todayMinutes = today.getMinutes();

    const firstDate = new Date(today.getFullYear(), today.getMonth(), 1); // the first day of this month
    const firstDay = firstDate.getDay();
    let firstWeekDay = 0;
    if (firstDay <= weekToday) {
      firstWeekDay = weekToday - firstDay + 1;
    } else {
      firstWeekDay = weekToday + firstDay;
    }

    if (breaktime.breakDate !== '') {
      for (const breakDay of breaktime.breakDay) {
        if (breakDay == weekToday) {
          if (breaktime.breakWeek == undefined)
            return '휴무일';
          for (const breakWeek of breaktime.breakWeek) {
            if (firstWeekDay + breakWeek * 7 == todayDate)
              return '휴무일';
          }
        }
      }

      if (breaktime.onlyBreak)
        return '영업중';
    }

    if (breaktime[week[weekToday]] === undefined) {
      return '휴무일';
    } else {
      for (const timeline of breaktime[week[weekToday]]) {
        const start = timeline[0].split(':');
        const end = timeline[1].substring(0, timeline[1].indexOf(':') + 3).split(':');
        if (parseInt(start[0]) > parseInt(end[0])) {
          if (parseInt(start[0]) <= todayHour) {
            if (parseInt(start[0]) == todayHour && todayMinutes < parseInt(start[1])) {
            } else {
              return '영업중'
            }
          }
          else if (todayHour <= parseInt(end[0])) {
            if (parseInt(end[0]) == todayHour && todayMinutes > parseInt(end[1])) {
            } else {
              return '영업중'
            }
          }
          return '영업종료'
        }
        if (parseInt(start[0]) <= todayHour && todayHour <= parseInt(end[0])) {
          if (parseInt(start[0]) == todayHour && todayMinutes < parseInt(start[1])) {
          } else if (parseInt(end[0]) == todayHour && todayMinutes > parseInt(end[1])) {
          } else {
            return '영업중'
          }
        }
      }
      return '영업종료';
    }
  }

  async function kakaoSharing() {
    try {
      const response = await KakaoShareLink.sendLocation({
        address: restData['address'],
        addressTitle: restData['official_name'],
        content: {
          title: restData['official_name'],
          imageUrl:
            'http://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg',
          link: {
            webUrl: 'https://developers.kakao.com/',
            mobileWebUrl: 'https://developers.kakao.com/',
          },
          description: restData['address'],
        },
        buttons: [{
          title: '앱으로 연결',
          link: {
            // androidExecutionParams: [
            //   { key: 'title', value: restData['name'] },
            //   { key: 'restId', value: restData['id'] },
            // ],
            // iosExecutionParams: [
            //   { key: 'title', value: restData['name'] },
            //   { key: 'restId', value: restData['id'] },
            // ],
          },
        }],
      });
    } catch (e) {
      if (e.message == '카카오톡이 설치되어있지 않습니다.') {
        toast.show({
          title: '공유 실패',
          description: '카카오톡이 설치되어 있지 않습니다.',
          status: 'error',
          style: { width: 320 }
        })
      } else {
        toast.show({
          title: '오류 발생',
          description: e.message,
          status: 'error',
          style: { width: 320 }
        })
      }
    }
  }

  return (
    <>
      <Animated.View style={props.scrollAnimation}>
        <MapView
          restName={restData['official_name']}
          position={{ latitude: restData['y'], longitude: restData['x'] }}
        />
      </Animated.View>
      <View style={style.partition}>
        <View style={[style.partitionPadding, { marginBottom: 15 }]}>
          <Rating
            type="custom"
            ratingImage={require('../../images/info-icon/star.png')}
            ratingColor="#BF2A52"
            ratingBackgroundColor="#ddd"
            startingValue={restData['total'] ? restData['total'] : 0}
            imageSize={50}
            fractions={1}
            readonly={true}
            onFinishRating={console.log}
          />
          <Text style={{ marginTop: 10, fontSize: 20, textAlign: "center", fontWeight: 'bold', color: '#444' }}>
            {restData['total'] ? Math.round(restData['total'] * 10) / 10 : 0} / 5
          </Text>
        </View>
        <View style={style.basicInfoPadding}>
          <InfoView icon="phone" value={restData['contact']} />
          <InfoView icon="location-arrow" value={restData['address']} />
          <InfoView
            icon="clock-o"
            value={openingParse(openingHour, new Date().getDay())}
            onPress={() => setShowOpenHour(true)} />
        </View>
        <InfoModal
          isOpen={showOpenHour}
          onClose={() => setShowOpenHour(false)}
          restName={restData['official_name']}
          openHour={openingParse(openingHour)}
        />
        <View style={style.openCheckLayout}>
          <View style={style.openCheckBox}>
            <Text style={style.openCheckText}>{isRestOpen(openingHour)}</Text>
          </View>
        </View>
        <HStack style={{ marginTop: 15, marginHorizontal: 10 }}>
          <Center style={[style.optionView, style.horizonStack]}>
            <Button style={style.optionButton} onPress={() => {
              navigation.navigate("같이 배달", { screen: "새로운 채팅방 만들기", params: { restName: restData['official_name'] } });
            }}>
              <Image
                alignSelf="center"
                resizeMode="contain"
                source={require('../../images/info-icon/food-delivery.png')}
                alt="Alternate Text"
                size="30px"
              />
              <Text style={{ textAlign: "center", marginTop: 5 }}>같이배달</Text>
            </Button>
          </Center>
          <Center style={[style.optionView, style.horizonStack]}>
            <Button style={style.optionButton} onPress={() => setTog(!tog)}>
              <Font style={{ textAlign: "center" }} name={tog ? "heart" : "heart-o"} size={30} color="#f15c5c" />
              <Text style={{ textAlign: "center", marginTop: 5 }}>찜하기</Text>
            </Button>
          </Center>
          <Center style={[style.optionView, style.horizonStack, { borderRightWidth: 0 }]}>
            <Button style={style.optionButton} onPress={kakaoSharing}>
              <Image
                alignSelf="center"
                resizeMode="contain"
                source={require('../../images/info-icon/share.png')}
                alt="Alternate Text"
                size="30px"
              />
              <Text style={{ textAlign: "center", marginTop: 5 }}>카카오톡 공유</Text>
            </Button>
          </Center>
        </HStack>
      </View>
      <View style={[style.partition, style.partitionPadding]}>
        <View style={style.contexts}>
          <KeyTextView keyText="메뉴" />
        </View>
        {menu}
      </View>
      <View style={[style.partition, style.partitionPadding, style.endMargin]}>
        <View style={style.contexts}>
          <KeyTextView keyText="평점" />
        </View>
        <HStack>
          <Center style={style.horizonStack}>
            <RatingBar
              color="#eab308"
              bgText="#eab308"
              textColor="#fff"
              ratingName="맛"
              ratingData={restData['flavor']}
            />
          </Center>
          <Center style={style.horizonStack}>
            <RatingBar
              color="#d97706"
              bgText="#d97706"
              textColor="#fff"
              ratingName="가성비"
              ratingData={restData['cost_performance']}
            />
          </Center>
          <Center style={style.horizonStack}>
            <RatingBar
              color="#65a30d"
              bgText="#65a30d"
              textColor="#fff"
              ratingName="서비스"
              ratingData={restData['service']}
            />
          </Center>
        </HStack>
        <View style={style.horizontalLayout}>
          <Text style={{ color: '#57534e', fontWeight: 'bold' }}>
            총 <Text style={{ color: '#292524' }}>{restData['comments_count']}</Text>명이 참여해주셨습니다.
          </Text>
        </View>
        {comments}
      </View>
    </>
  );
}

const RestaurantInfo = (props) => {
  const animatedScroll = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [restData, setData] = useState({});
  let restDir = '/식당/' + props.restId;
  const restRef = database().ref(restDir);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
          total: 0
        }).then(onRefresh);
      } else {
        const comment = restData['comments'][commentId];
        restRef.update({
          comments_count: commentsCount - 1,
          flavor: (restData['flavor'] * commentsCount - comment['맛']) / (commentsCount - 1),
          cost_performance: (restData['cost_performance'] * commentsCount - comment['가성비']) / (commentsCount - 1),
          service: (restData['service'] * commentsCount - comment['서비스']) / (commentsCount - 1),
          total: (restData['total'] * commentsCount - comment['종합']) / (commentsCount - 1)
        }).then(onRefresh);
      }
    });
  }

  const scrollAnimation = (animatedScroll, screenWidth) => {
    return ({
      width: screenWidth,
      height: screenWidth,
      overflow: 'hidden',
      transform: [{
        translateY: animatedScroll.interpolate({
          inputRange: [-screenWidth, 0, screenWidth, screenWidth + 1],
          outputRange: [-screenWidth * 0.3, 0, screenWidth * 0.8, screenWidth * 0.8],
        }),
      }]
    })
  }

  return (
    <SafeAreaView style={style.containter}>
      <NativeBaseProvider>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: animatedScroll } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
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
            scrollAnimation={scrollAnimation(animatedScroll, Dimensions.get('window').width)}
          />
        </Animated.ScrollView>
        <CommentButton
          restaurantData={restData}
          commentsDir={restDir}
          onFinish={onRefresh}
        />
      </NativeBaseProvider>
    </SafeAreaView>
  )
}

const ItemActivity = ({ navigation, route }) => {
  const RestInfo = () => {
    return <RestaurantInfo restId={route.params.restId} />;
  }

  return (
    <NativeBaseProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="식당 정보 화면"
          component={RestInfo}
          initialParams={route.params}
          options={{
            headerTitle: () => (
              <Text style={style.headerTitle}>{route.params.title}</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableHighlight
                activeOpacity={0.4}
                underlayColor="#BF2A52"
                onPress={navigation.goBack}>
                <Image
                  resizeMode="contain"
                  source={require('../../images/info-icon/list.png')}
                  alt="Alternate Text"
                  size="30px"
                  style={{ tintColor: "#fff" }}
                />
              </TouchableHighlight>
            )
          }}
        />
        <Stack.Screen
          name="식당 위치"
          component={MapScreen}
          options={({ route }) => ({
            headerTitle: () => (
              <Text style={style.headerTitle}>{route.params.name} 위치</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerRight: () => (
              <TouchableHighlight
                activeOpacity={0.4}
                underlayColor="#BF2A52"
                onPress={() => navigation.navigate('식당 길찾기', { name: route.params.name, coordinate: route.params.coordinate, myPosition: route.params.myPosition })}>
                <Image
                  resizeMode="contain"
                  source={require('../../images/info-icon/marker.png')}
                  alt="Alternate Text"
                  size="30px"
                  style={{ tintColor: "#fff" }}
                />
              </TouchableHighlight>
            ),
            animation: 'slide_from_right'
          })}
        />
        <Stack.Screen
          name="식당 길찾기"
          component={RouteWebScreen}
          options={{
            headerTitle: () => (
              <Text style={style.headerTitle}>{route.params.title} 길찾기</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            animation: 'slide_from_right'
          }}
        />
      </Stack.Navigator>
    </NativeBaseProvider>
  );
}

export default ItemActivity;

const style = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5',
    fontFamily: 'ELANDChoiceB'
  },
  containter: {
    height: '100%',
    backgroundColor: '#f5f5f5'
  },
  contexts: {
    flexDirection: 'row',
    marginBottom: 27,
  },
  partition: {
    backgroundColor: '#ffffff',
    marginTop: 1.5,
    paddingTop: 18,
    paddingBottom: 40
  },
  partitionPadding: {
    paddingHorizontal: 18
  },
  basicInfoPadding: {
    paddingHorizontal: 35
  },
  horizontalLayout: {
    flexDirection: 'row-reverse',
    marginVertical: 10,
    paddingVertical: 10
  },
  mapView: {
    width: '100%',
    aspectRatio: 1,
  },
  endMargin: {
    marginBottom: 100
  },
  horizonStack: {
    justifyContent: 'center',
    width: '33%',
  },
  optionView: {
    borderColor: '#ededed',
    borderRightWidth: 1.5
  },
  optionButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: 'white'
  },
  openCheckLayout: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3
  },
  openCheckBox: {
    backgroundColor: '#34d399',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  openCheckText: {
    fontSize: 14,
    color: '#ffffff'
  },
})