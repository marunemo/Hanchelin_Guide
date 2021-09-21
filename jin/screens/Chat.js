import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { NativeBaseProvider, Modal, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Text from '../../defaultSetting/FontText';

export default function Chat({ route }) {
  const { thread } = route.params;
  const user = auth().currentUser;
  const [messages, setMessages] = useState([]);
  const [deadline, setDeadline] = useState(true);

  useEffect(() => {
    const unsubscribeListener = firestore()
      .collection('Chat')
      .doc(thread._id)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          }

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            }
          }

          return data;
        })

        setMessages(messages);
      })

    setTimeout(() => {
      setDeadline(false);
    }, new Date(thread.endTime.seconds) - new Date());

    return () => unsubscribeListener();
  }, [])

  async function handleSend(messages) {
    const text = messages[0].text;

    firestore()
      .collection('Chat')
      .doc(thread._id)
      .collection('Messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: user?.uid,
          displayName: user?.displayName,
        }
      })

    await firestore()
      .collection('Chat')
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          }
        },
        { merge: true }
      )
  }

  async function extendTime() {
    await firestore()
      .collection('Chat')
      .doc(thread._id)
      .set({endTime: new Date(new Date(thread.endTime.seconds).getTime() + 5 * 60 * 1000)})
  }

  return (
    <NativeBaseProvider>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{
          _id: user?.uid,
          name: user?.displayName,
          avatar: user?.photoURL,
        }}
        renderUsernameOnMessage
        placeholder={'메시지를 입력하세요...'}
      />
      <Modal isOpen={deadline}>
        <Modal.Header>시간 연장</Modal.Header>
        <Modal.Body>확인 버튼을 누르면 채팅방 유지 시간을 5분 더 연장하실 수 있습니다.</Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button
              variant="solid"
              onPress={extendTime}
            >
              확인
            </Button>
            <Button
              variant="ghost"
              onPress={useNavigation().goBack}
            >
              취소
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal>
    </NativeBaseProvider>
  );
}