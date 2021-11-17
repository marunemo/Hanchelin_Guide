import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { DrawerActions } from '@react-navigation/native';
import { getDrawerStatusFromState } from '@react-navigation/drawer';
import { NativeBaseProvider, Modal, Button } from 'native-base';

export default function Chat({ navigation, route }) {
  const { thread } = route.params;
  const user = auth().currentUser;
  const [messages, setMessages] = useState([]);
  const [deadline, setDeadline] = useState(false);

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

    const removeTimer = setInterval(() => {
      if(new Date(thread.endTime.seconds * 1000) < new Date())
        setDeadline(true);
    }, 10 * 1000);

    return () => {
      unsubscribeListener();
      clearTimeout(removeTimer);
    }
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
      .update({ endTime: new Date(new Date(thread.endTime.seconds * 1000).getTime() + 5 * 60 * 1000) })
      .then(() => {
        setDeadline(false);
      })
      .catch(err => {
        if (err.message == '[firestore/not-found] Some requested document was not found.') {
          navigation.navigate('같이 배달 리스트', { response: 1 });
        } else {
          console.log(err)
        }
      })
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
      <Modal
        isOpen={deadline}
        onClose={() => setDeadline(false)}
        avoidKeyboard={true}
        closeOnOverlayClick={false}
      >
        <Modal.Content>
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
                onPress={() => {
                  if (getDrawerStatusFromState(navigation.getState()) === 'open')
                    navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.goBack();
                }}
              >
                취소
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
}