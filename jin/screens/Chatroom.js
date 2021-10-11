import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Text from '../../defaultSetting/FontText';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, Stack, HStack, Modal, Button, useToast, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Authentication from './Authentication';
import CreateChat from "./CreateChat";
import Chat from "./Chat";
import HeaderClassicSearchBar from "../../lib/src/HeaderClassicSearchBar/HeaderClassicSearchBar";
const [headerColor, iconActiveColor, iconInActiveColor] = ["#efefef", "#BF2A52", "#bbb"];

const StackNav = createNativeStackNavigator();

function Chatroom({ navigation, route }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(new Date().getMinutes());
  const toast = useToast();

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

    const { response } = route.params;
    if (response === 0) {
      toast.show({
        title: '삭제 완료',
        description: '채팅방이 완전히 삭제되었습니다.',
        status: 'success',
        style: { width: 320 }
      })
      navigation.setParams({ response: -1 })
    } else if (response === 1) {
      toast.show({
        title: '연장 실패',
        description: '채팅방의 연장 시간이 마감되어, 채팅방이 삭제되었습니다.',
        status: 'error',
        style: { width: 320 }
      })
      navigation.setParams({ response: -1 })
    }

    const refreshTimer = setInterval(() => {
      let currentMinutes = new Date().getMinutes();
      if (currentMinutes != timer)
        setTimer(currentMinutes);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(refreshTimer);
    }
  }, [route.params.response]);

  if (loading) {
    return <Spinner size="lg" color="gray.300" />
  } else if (!threads.length) {
    return (
      <NativeBaseProvider>
        <View style={styles.emptyView}>
          <Spinner size="sm" color="rose.500" />
          <Text style={styles.emptyText}>생성된 채팅방이 없습니다.</Text>
        </View>
      </NativeBaseProvider>
    )
  }

  function leftMinutes(deadLine) {
    const deadSecond = new Date(deadLine.seconds * 1000);
    const gracePeriod = deadSecond.getTime + 5 * 60 * 1000;
    const currTime = new Date();
    if (currTime > gracePeriod)
      return -10;
    return (deadSecond.getHours() - currTime.getHours()) * 60 + (deadSecond.getMinutes() - currTime.getMinutes())
  }

  function isClosed(itemId, leftMin) {
    if (leftMin >= -5) {
      return true;
    }

    firestore().collection('Chat').doc(itemId).delete();
    return false;
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <HeaderClassicSearchBar
          backgroundColor={headerColor}
          iconActiveColor={iconActiveColor}
          iconInactiveColor={iconInActiveColor}
          iconBool={false}
        // switchValue={this.state.switchValue}
        // onChangeText={(term) => { this.searchUpdated(term) }}
        // onPress={() => this.setState({ switchValue: !(this.state.switchValue) })}
        // TODO::필터 기능 추가하기
        />
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          extraData={timer}
          renderItem={({ item }) => {
            const leftMin = leftMinutes(item.endTime);
            return (
              isClosed(item._id, leftMin) &&
              <TouchableOpacity onPress={() => navigation.navigate('메시지', { thread: item })}>
                <View style={styles.listContainer}>
                  <View style={styles.listContent}>
                    <View style={styles.listHeader}>
                      <Text style={styles.nameText}>{item.name}</Text>
                      <View style={styles.deadlineView(leftMin)}>
                        <Text style={styles.deadlineText}>{leftMin >= 0 ? +leftMin + '분 남음' : '마감'}</Text>
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
            )
          }}
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
        navigation.navigate('같이 배달 리스트', { response: 0 });
      })
  }

  return (
    <NativeBaseProvider>
      <StackNav.Navigator>
        <StackNav.Screen
          name="같이 배달 리스트"
          component={Chatroom}
          initialParams={{ response: -1 }}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle} bold>같이 배달</Text>
            ),
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerRight: () => (
              <Icon name="plus" size={24} color="#fff"
                onPress={() => navigation.navigate('새로운 채팅방 만들기')} />
            )
          }} />
        <StackNav.Screen
          name="새로운 채팅방 만들기"
          component={CreateChat}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle} bold>{"새로운 채팅방 만들기"}</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            animation: 'slide_from_right'
          }} />
        <StackNav.Screen
          name="메시지"
          component={Chat}
          options={({ route }) => ({
            headerTitle: () => (
              <Text style={styles.headerTitle} bold>{route.params.thread.name}</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            animation: 'fade_from_bottom',
            headerRight: () => (
              (user?.uid === route.params.thread.initialUser) &&
              <Icon name="trash" size={24} color="#fff"
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
    backgroundColor: "#fff"
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
    height: 100,
    borderBottomColor: '#ededed',
    borderBottomWidth: 0.5,
    borderRadius: 15
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
  deadlineView: (leftMin) => ({
    backgroundColor:
      leftMin >= 10 ?
        '#6ee7b7' :
        leftMin >= 5 ?
          '#fde047' :
          leftMin >= 3 ?
            '#fdba74' :
            leftMin >= 1 ?
              '#f87171' :
              leftMin >= 0 ?
                '#ef4444' :
                '#dc2626'
    ,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 15,
  }),
  deadlineText: {
    color: '#fff',
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
  },
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5'
  },
  emptyView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 20
  },
  emptyText: {
    fontSize: 21,
    color: '#4f4f4f',
    marginLeft: 12
  }
})