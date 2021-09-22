// 유저 프로필 페이지

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet } from 'react-native';
import { 
  NativeBaseProvider, 
  HStack, 
  VStack, 
  Center, 
  ScrollView, 
  Button, 
  Stack, 
  View, 
  Image } from 'native-base';
import Text from '../../defaultSetting/FontText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { black } from 'color-name';
import { fontStyle, fontWeight } from 'styled-system';

export default function Profile (props) {
    const user = auth().currentUser;
    const [review, setReview] = useState([]);
    const [store, setStore] = useState([]);

    useEffect(() => {
      firestore().collectionGroup('리뷰')
        //.orderBy('createdAt', 'desc')
        .where('uid', '==', user?.uid)
        .onSnapshot(querySnapshot => {
          let review = []

          querySnapshot.forEach(documentSnapshot => {
            const item = documentSnapshot.data();
            let storeName = documentSnapshot.ref.parent.parent.id

            review.push(
              <View style={styles.content} key={documentSnapshot.id}>
                <Text>내용 : {item['리뷰']}</Text>
                <Text>별점 : {'★'.repeat(item['종합'])}</Text>
                <Text>식당 이름 : {storeName}</Text>
              </View>
            );
          });

          setReview(review)
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
          <ScrollView>
            <Stack alignItems='center' style={styles.stack}>
              <HStack alignItems='center'>
                <Image source={{ uri: user?.photoURL }} style={styles.image} alt='사진 없음' />
                <VStack alignItems='center' style={styles.vstack}>
                  <Text style={styles.text}>{user?.displayName}</Text>
                  <Text style={styles.text}>{user?.email}</Text>
                </VStack>
              </HStack>
            </Stack>
            <Button style={styles.button} onPress={() => auth().signOut()} bg='#BF2A52'>
              <Text style={{ color: 'white' }} bold>로그아웃</Text>
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
    },
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      color: 'white',
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
    },
    header: {
      fontSize: 25,
      borderWidth: 2,
      padding: 10,
      margin: 10
    },
    content: {
      fontSize: 18,
      padding: 10,
      margin: 10,
      borderColor: black,
      borderWidth: 1,
    }
});