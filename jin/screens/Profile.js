// 유저 프로필 페이지

import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {
  NativeBaseProvider,
  HStack,
  VStack,
  Center,
  ScrollView,
  Button,
  Stack,
  View,
  Image
} from 'native-base';
import Text from '../../defaultSetting/FontText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function Profile(props) {
  const user = auth().currentUser;
  const navigation = useNavigation();
  const [review, setReview] = useState([]);
  const [store, setStore] = useState([]);

  useEffect(() => {
    firestore().collectionGroup('리뷰')
      //.orderBy('createdAt', 'desc')
      .where('uid', '==', user?.uid)
      .orderBy('작성시간', 'asc')
      .onSnapshot(querySnapshot => {
        let review = [];

        if (querySnapshot !== null) {
          querySnapshot.forEach(documentSnapshot => {
            const item = documentSnapshot.data();
            console.log(item)
            let storeName = documentSnapshot.ref.parent.parent.id

            review.push(
              <TouchableOpacity
                key={documentSnapshot.id}
                onPress={() => navigation.navigate('식당 정보', { title: storeName, restId: item.restId })}
              >
                <View style={styles.content}>
                  <Text>내용 : {item['리뷰']}</Text>
                  <Text>별점 : {'★'.repeat(item['종합'])}</Text>
                  <Text>식당 이름 : {storeName}</Text>
                  <Text>작성일 : {new Date(item['작성시간'].seconds).toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            );
          });

          setReview(review);
        }
      });

    firestore()
      .collection('store')
      .where('heart', 'array-contains', user?.uid)
      .onSnapshot(querySnapshot => {
        let store = []

        querySnapshot.forEach(documentSnapshot => {
          const item = documentSnapshot.data();
          store.push(
            <View style={styles.content} key={documentSnapshot.id}>
              <Text>가게 이름 : {item.name}</Text>
            </View>
          );
        });

        setStore(store)
      });
  }, []);

  // 가져 올 리뷰와 찜이 없을때 에러 안뜨게 하기
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <ScrollView width="100%" p={5}>
          <Stack alignItems='center' style={styles.stack}>
            <HStack alignItems='center'>
              <Image source={{ uri: user?.photoURL }} style={styles.image} alt='사진 없음' />
              <VStack style={styles.vstack}>
                <Text style={styles.text}>{user?.displayName}</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
              </VStack>
            </HStack>
          </Stack>
          <Button style={styles.button}
            onPress={() => auth().signOut()}
            bg='#BF2A52'
            width="70%"
            colorScheme="gray"
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>로그아웃</Text>
          </Button>
          <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: 40, paddingBottom: 10, }}>내가 쓴 리뷰</Text>
          {review}
          <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: 40, paddingBottom: 10, }}>내가 찜한 가게</Text>
          {store}
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  stack: {
    marginTop: 20,
  },
  vstack: {
    marginLeft: 20,
    alignItems: 'center'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    color: 'white',
    alignSelf: 'center'
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 70,
    marginBottom: 0,
  },
  text: {
    fontSize: 20,
    marginBottom: 5
  },
  emailText: {
    fontSize: 16,
  },
  header: {
    fontSize: 25,
    borderWidth: 2,
    padding: 10,
    margin: 10
  },
  content: {
    fontSize: 18,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 30,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1,
  }
});