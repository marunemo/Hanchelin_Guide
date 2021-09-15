import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Text from '../../defaultSetting/FontText';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, Stack, HStack, Modal, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Authentication from './Authentication';
import CreateChat from "./CreateChat";
import Chat from "./Chat";

const StackNav = createNativeStackNavigator();

function Chatroom({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Chat')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            location: '',
            store: '',
            endTime: 0,
            latestMessage: { text: '' },
            ...documentSnapshot.data()
          }
        })

        setThreads(threads);
        //console.log(threads);
        if (loading) {
          setLoading(false);
        }
      })

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator />
  }

  function leftMinutes(deadLine) {
    const deadSecond = new Date(deadLine.seconds * 1000);
    const currTime = new Date();
    return (deadSecond.getHours() - currTime.getHours()) * 60 + (deadSecond.getMinutes() - currTime.getMinutes())
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('메시지', { thread: item })}>
              <View style={styles.listContainer}>
                <View style={styles.listContent}>
                  <View style={styles.listHeader}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <View style={styles.deadLineView}>
                      <Text style={styles.deadlineText}>{leftMinutes(item.endTime)}분 남음</Text>
                    </View>
                  </View>
                  <Text style={styles.contentText}>
                    {item.latestMessage.text != undefined && item.latestMessage.text.slice(0, 90)}
                  </Text>
                  <Stack>
                    <HStack marginRight={3} alignSelf="flex-end" space={3}>
                      <Text>가게명: {item.store}</Text>
                      <Text bold>|</Text>
                      <Text>배달 위치: {item.location}</Text>
                    </HStack>
                  </Stack>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </NativeBaseProvider>
  );
}

export default function ({ navigation }) {
  const user = auth().currentUser;
  const [showAuthModal, setShowAuthModal] = useState(false);

  function deleteChat(id) {
    firestore()
      .collection('Chat')
      .doc(id)
      .delete().then(() => {
        setShowAuthModal(false);
        navigation.navigate('같이 배달 리스트');
      })
  }

  return (
    <NativeBaseProvider>
      <StackNav.Navigator>
        <StackNav.Screen
          name="같이 배달 리스트"
          component={Chatroom}
          options={{
            title: '같이 배달',
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#f2f2f2',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            headerRight: () => (
              <Icon name="plus" size={24} color="#f2f2f2"
                onPress={() => navigation.navigate('새로운 채팅방 만들기')} />
            )
          }} />
        <StackNav.Screen
          name="새로운 채팅방 만들기"
          component={CreateChat}
          options={{
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#f2f2f2',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            animation: 'slide_from_right'
          }} />
        <StackNav.Screen
          name="메시지"
          component={Chat}
          options={({ route }) => ({
            title: route.params.thread.name,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#f2f2f2',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            animation: 'fade_from_bottom',
            headerRight: () => (
              (user?.uid === route.params.thread.initialUser) &&
              <Icon name="trash" size={24} color="#f2f2f2"
                onPress={() => setShowAuthModal(route.params.thread)}
              />
            )
          })}
        />
      </StackNav.Navigator>
      <Modal isOpen={!!showAuthModal} onClose={() => setShowAuthModal(false)}>
        <Modal.Content style={styles.modalContent}>
          <Modal.Header>정말로 채팅방을 삭제하시겠습니까?</Modal.Header>
          <Modal.Body>채팅방을 지우면 다시 되돌릴 수 없습니다. 신중히 선택해주세요.</Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost">
              <Button onPress={() => deleteChat(showAuthModal._id)}>예</Button>
              <Button onPress={() => setShowAuthModal(false)}>아니요</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500'
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#999999'
  },
  listContent: {
    flexShrink: 1
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000'
  },
  deadLineView: {
    backgroundColor: '#6ee7b7',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 15,
  },
  deadlineText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  contentText: {
    color: '#777777',
    fontSize: 16,
    marginVertical: 6,
    marginLeft: 5
  },
  modalContent: {
    minWidth: 100,
    maxWidth: 250,
    minHeight: 100,
    maxHeight: 250,
    justifyContent: 'center',
    alignItems: 'center'
  }
})