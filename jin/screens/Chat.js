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
  const [endTime, setEndTime] = useState(thread.endTime.seconds * 1000);

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

    if(endTime < new Date().getTime())
      setDeadline(true);
    const removeTimer = setInterval(() => {
      if(endTime < new Date().getTime())
        setDeadline(true);
    }, 5 * 1000);

    return () => {
      unsubscribeListener();
      clearTimeout(removeTimer);
    }
  }, [endTime])

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
      .update({ endTime: new Date(endTime + 5 * 60 * 1000) })
      .then(() => {
        setDeadline(false);
        setEndTime(endTime + 5 * 60 * 1000);
      })
      .catch(err => {
        if (err.message == '[firestore/not-found] Some requested document was not found.') {
          navigation.navigate('?????? ?????? ?????????', { response: 1 });
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
        placeholder={'???????????? ???????????????...'}
      />
      <Modal
        isOpen={deadline}
        onClose={() => setDeadline(false)}
        avoidKeyboard={true}
        closeOnOverlayClick={false}
      >
        <Modal.Content>
          <Modal.Header>?????? ??????</Modal.Header>
          <Modal.Body>?????? ????????? ????????? ????????? ?????? ????????? 5??? ??? ???????????? ??? ????????????.</Modal.Body>
          <Modal.Footer>
            <Button.Group>
              <Button
                variant="solid"
                onPress={extendTime}
              >
                ??????
              </Button>
              <Button
                variant="ghost"
                onPress={() => {
                  if (getDrawerStatusFromState(navigation.getState()) === 'open')
                    navigation.dispatch(DrawerActions.closeDrawer());
                  navigation.goBack();
                }}
              >
                ??????
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
}