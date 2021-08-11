// 유저 프로필 페이지

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, SectionList, SafeAreaView, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function Profile (props) {
    const user = auth().currentUser;
    const [review, setReview] = useState([]);
    const [store, setStore] = useState([]);

    useEffect(() => {
      /* 리뷰 데이터를 스토어에 업로드 할때 유저의 고유 아이디인 uid를 같이 업로드하여
      .where()로 필터링하여 유저 개인 페이지에 표시한다*/
      firestore().collection('가게').doc('9월애').collection('리뷰')

        /* 
        시간대별 정렬이랑 uid 필터가 따로하면 잘되는데 같이 하면 에러 뜸. SOF에서는 무슨 에러 핸들링 어쩌고 하는데
        공홈 보니까 다른 필드에 있는 쿼리끼리는 호환이 안된다고 써있는거 같음. 그니까 uid 필드에서는 필터+정렬이
        가능한데 uid 필드에서 필터링해오고 createdAt 필드에서 시간으로 정렬하는게 안된다는건가봐
        
        따라서 그냥 식당리스트+리뷰에서는 uid가 필요없으니까 이걸로 시간정렬이 가능하지만 유저 프로필에서는 따로
        해야된다
        */

        //.orderBy('createdAt', 'desc')
        .where('uid', '==', user?.uid)
        .onSnapshot(querySnapshot => {
          let review = []

          querySnapshot.forEach(documentSnapshot => {
            const item = documentSnapshot.data();
            review.push(
              <View style={styles.content} key={documentSnapshot.id}>
                <Text>내용 : {item['총평']}</Text>
                <Text>별점 : {'★'.repeat(item['종합'])}</Text>
                <Text>UID : {item['uid']}</Text>
              </View>
            );
          });

          setReview(review)
        });
      
      /* 리뷰와 비슷하긴 하지만 각 음식점 콜렉션에 찜을 했는지의 여부 체크를 찜 버튼을 누르면 uid를 array로
      업로드한 다음 array에 현재 유저의 uid가 있으면 표시한다.
      찜 버튼을 눌렀을 때 collection 안에 있는 array에 data 추가/삭제 방법 알아보기 */
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
      <SafeAreaView style={styles.screen}>
        <ScrollView>
          <View style={styles.info}>
            <Text style={styles.title}>프로필</Text>
            <Image source={{ uri: user?.photoURL }} style={styles.image} />
            <Text style={styles.text}>{user?.displayName}</Text>
            <Text style={styles.text}>{user?.email}</Text>
            <Text>{user?.uid}</Text>
            <View style={{ marginTop: 30 }}>
              <Button title="로그아웃" onPress={() => auth().signOut()} />
            </View>
          </View>
          <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: 40, paddingBottom: 10, }}>내가 쓴 리뷰</Text>
            {review}
          <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: 40, paddingBottom: 10, }}>내가 찜한 가게</Text>
            {store}
        </ScrollView>  
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
    },
    info: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 25,
      marginBottom: 30,
    },
    image: {
      height: 100,
      width: 100,
      borderRadius: 100,
      marginBottom: 20,
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
      backgroundColor: "grey",
      padding: 10,
      margin: 10
    }
});