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
  Image,
  Input
} from 'native-base';
import Modal from 'react-native-modal';
import Text from '../../defaultSetting/FontText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { whileStatement } from '@babel/types';
import { fontSize } from 'styled-system';

export default function Profile(props) {
  const user = auth().currentUser;
  const navigation = useNavigation();
  const [review, setReview] = useState([]);
  const [store, setStore] = useState([]);
  const [nickname, setNickname] = useState('');
  const [checkNickname, setCheckNickname] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const nameRef = firestore().collection('user');

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
      .collectionGroup('찜')
      .where('userId', 'array-contains', user?.uid)
      .onSnapshot(querySnapshot => {
        let store = []

        querySnapshot.forEach(documentSnapshot => {
          const item = documentSnapshot.data();
          let storeName = documentSnapshot.ref.parent.parent.id

          store.push(
            <View style={styles.content} key={documentSnapshot.id}>
              <Text>가게 이름 : {storeName}</Text>
            </View>
          );
        });

        setStore(store)
      });

      firestore()
        .collection('user')
        .doc(user?.uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            setNickname(documentSnapshot.data().nickname)
            setCheckNickname(true)
          }
        });
  }, []);

  async function addNickname() {
    await nameRef.doc(user?.uid).set({
      nickname: nickname,
    }, {merge: true})
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }

  const NicknameView = () => {
    if (checkNickname) {
      return (
        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.emailText}>별명: {nickname}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={styles.emailText}>별명을 설정해주세요</Text>
        </TouchableOpacity>
        </>
      );
    }
  }

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
                <NicknameView />
                <Modal isVisible={isModalVisible}>
                  <SafeAreaView style={styles.modalView}>
                    <Text style={{ fontSize: 20, marginTop: 10 }}>별명을 입력해주세요</Text>
                    <Text style={{ fontSize: 10, marginTop: 5 }}>별명은 작성하신 리뷰에 이름대신 표시됩니다.</Text>
                    <Input 
                      style={{ marginTop: 30 }}
                      w={200}
                      multiline={false}
                      value={nickname}
                      onChangeText={setNickname}
                      avoidKeyboard={true}
                    />
                    <Button style={styles.button} bg='#BF2A52' onPress={() => addNickname()}>설정 완료</Button>
                    <TouchableOpacity style={styles.cancel} onPress={toggleModal}>
                      <Text style={styles.emailText}>취소</Text>
                    </TouchableOpacity>
                  </SafeAreaView>
                </Modal>
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
  },
  modalView: {
    backgroundColor: 'white',
    width: '73%',
    height: '35%',
    alignItems: 'center',
    marginLeft: 50,
    marginRight: 50,
  },
  cancel: {
    marginTop: 10
  }
});