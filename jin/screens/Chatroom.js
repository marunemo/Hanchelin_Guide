import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image,  
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Divider, NativeBaseProvider, Stack, HStack, Modal, Button, } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth, { firebase } from '@react-native-firebase/auth';
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
              <View style={styles.row}>
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text style={styles.nameText}>{item.name}</Text>
                  </View>
                  <Text style={styles.contentText}>
                    {item.latestMessage.text != undefined && item.latestMessage.text.slice(0, 90)}
                  </Text>
                  <Stack>
                    <HStack space={3}>
                      <Text>가게: {item.store}</Text>
                      <Text>위치: {item.location}</Text>
                      <Text>모집마감: {leftMinutes(item.endTime)}분 남았습니다.</Text> 
                    </HStack>
                  </Stack>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Divider bg='black' />}
        />
      </View>
    </NativeBaseProvider>
  );
}

export default function ({ navigation }) {
  const user = auth().currentUser;
  const [showModal, setShowModal] = useState(false); // 권한이 없을때의 modal 보여주기
  const [showAuthModal, setShowAuthModal] = useState(false); // 권한이 있을때의 modal 보여주기
  const [isFinal, setIsFinal] = useState(false); // 채팅방 삭제 최종 확인

  async function deleteChat (props) {
    if (user?.uid === props.initialUser) {
      setShowAuthModal(true)

      firestore()
      .collection('Chat')
      .doc(props._id)
      .delete()
      
      navigation.navigate('같이 배달 리스트')
    } else {
      setShowModal(true)
    }
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
              <Icon name="times" size={24} color="#f2f2f2"
                onPress={() => deleteChat(route.params.thread)}
              />
            )
          })}
        />
      </StackNav.Navigator>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content minWidth={200} minHeight={200}>
          <Modal.CloseButton />
          <Modal.Header alignItems='center'>삭제 권한이 없습니다.</Modal.Header>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}>
        <Modal.Content minWidth={200} minHeight={200} alignItems='center'>
          <Modal.CloseButton />
          <Modal.Header>채팅이 삭제되었습니다.</Modal.Header>
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
  row: {
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flexShrink: 1
  },
  header: {
    flexDirection: 'row'
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000'
  },
  dateText: {},
  contentText: {
    color: '#949494',
    fontSize: 16,
    marginTop: 2
  }
})