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
  Input,
  Modal
} from 'native-base';
import Text from '../../defaultSetting/FontText';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { whileStatement } from '@babel/types';
import { fontSize } from 'styled-system';
import { Rating } from 'react-native-ratings';

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
            let storeName = documentSnapshot.ref.parent.parent.id

            review.push(
              <TouchableOpacity
                key={documentSnapshot.id}
                onPress={() => navigation.navigate('식당 정보', { title: storeName, restId: item.restId })}
              >
                <View style={styles.content}>
                  <Text style={styles.reviewTitle} bold>{storeName}</Text>
                  <Rating
                    type="custom"
                    ratingImage={require('../../images/info-icon/star.png')}
                    ratingColor="#BF2A52"
                    ratingBackgroundColor="#ddd"
                    startingValue={item['종합']}
                    imageSize={40}
                    fractions={0}
                    readonly={true}
                    onFinishRating={console.log}
                  />
                  <Text style={styles.reviewContent}>{item['리뷰']}</Text>
                  <Text style={styles.reviewDate}>{dateFormat(item['작성시간'].seconds)}</Text>
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
    }, { merge: true })
  }

  async function resetNickname() {
    await nameRef.doc(user?.uid).delete();
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

  function dateFormat(seconds) {
    const targetDate = new Date(seconds * 1000);
    return targetDate.getFullYear() + '년 ' + targetDate.getMonth() + '월 ' + targetDate.getDate() + '일 '
      + ((targetDate.getHours() < 10) ? '0' : '') + targetDate.getHours() + ':'
      + ((targetDate.getMinutes() < 10) ? '0' : '') + targetDate.getMinutes() + ':'
      + ((targetDate.getSeconds() < 10) ? '0' : '') + targetDate.getSeconds();
  }

  // 가져 올 리뷰와 찜이 없을때 에러 안뜨게 하기
  return (
    <NativeBaseProvider>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Center flex={1} width="100%">
          <Stack alignItems='center' style={styles.stack}>
            <HStack alignItems='center'>
              <Image source={{ uri: user?.photoURL }} style={styles.image} alt='사진 없음' />
              <VStack style={styles.vstack}>
                <Text style={styles.text}>{user?.displayName}</Text>
                <Text style={styles.emailText}>{user?.email}</Text>
              </VStack>
            </HStack>
          </Stack>
          <Button.Group style={styles.menuButtonGroup}>
            <Button style={styles.menuButton}
              onPress={toggleModal}
              bg='#BF2A52'
              width="70%"
              colorScheme="gray"
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>닉네임 설정</Text>
            </Button>
            <Button style={styles.menuButton}
              onPress={() => auth().signOut()}
              bg='#BF2A52'
              width="70%"
              colorScheme="gray"
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>로그아웃</Text>
            </Button>
          </Button.Group>
        </Center>
        <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: 40, paddingBottom: 10, }}>내가 쓴 리뷰</Text>
        {review}
        <Text style={{ alignSelf: 'center', fontSize: 24, paddingTop: 40, paddingBottom: 10, }}>내가 찜한 가게</Text>
        {store}
      </ScrollView>
      <Modal
        isOpen={isModalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        size="md"
      >
        <Modal.Content style={styles.modalView}>
        <Modal.Header style={{alignItems: 'center'}}>
          <Text style={{ fontSize: 20, marginTop: 10 }}>별명을 입력해주세요</Text>
          <Text style={{ fontSize: 12, marginTop: 5 }}>별명은 작성하신 리뷰에 이름대신 표시됩니다.</Text>
          </Modal.Header>
          <Modal.Body style={{alignItems: 'center', marginTop: 15}}>
          <Input
            w={200}
            multiline={false}
            value={nickname}
            placeholder={user?.displayName}
            onChangeText={setNickname}
          />
          <Button.Group style={styles.menuButtonGroup}>
            <Button
              style={styles.menuButton}
              bg='#BF2A52'
              onPress={() => {
                if (nickname === '') {
                  resetNickname();
                } else {
                  addNickname();
                }
                toggleModal();
              }}
            >
              <Text style={{ fontSize: 15 }}>완료</Text>
            </Button>
            <Button
              style={styles.menuButton}
              variant="ghost"
              onPress={toggleModal}
            >
              <Text style={{ fontSize: 15, color: '#BF2A52' }}>취소</Text>
            </Button>
          </Button.Group>
          </Modal.Body>
        </Modal.Content>
      </Modal>
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
  menuButtonGroup: {
    width: '60%',
    marginTop: 10,
    flexDirection: 'column'
  },
  menuButton: {
    width: '100%',
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
    width: '85%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  modalView: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  reviewTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  reviewContent: {
    fontSize: 16,
    color: '#222222',
    marginTop: 20,
    marginBottom: 8
  },
  reviewDate: {
    fontSize: 12,
    textAlign: 'right',
    color: '#777777'
  }
});