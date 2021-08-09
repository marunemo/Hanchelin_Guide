import React, { useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

export default function Chat({ route }) {
  const { thread } = route.params;
  const user = auth().currentUser;
  const [messages, setMessages] = useState([]);

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

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{
        _id: user?.uid
      }}
    />
  );
}