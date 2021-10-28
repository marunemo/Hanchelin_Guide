import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Text from '../defaultSetting/FontText';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, Modal, Button } from 'native-base';
import firestore from '@react-native-firebase/firestore';

import ChatRoom from './ChatListMenu';
import Chat from './ChatMenu';
import CreateChat from './screens/CreateChat';

const StackNav = createNativeStackNavigator();

export default function ({ navigation }) {
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
      <StackNav.Navigator
        // screenOptions={{ headerShown: false }}
      >
        <StackNav.Screen
          name="같이 배달 리스트"
          component={ChatRoom}
        />
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
          }}
        />
        <StackNav.Screen
          name="메시지"
          component={Chat}
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
  }
})