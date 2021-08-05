// 채팅 화면 - 아직 오류들이 있고, 카톡처럼 1:1 채팅 기능을 만드려면 좀 갈아엎어야 할 듯??

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

export default function Chat() {
  const user = auth().currentUser;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const subscribe = firestore()
      .collection('chatId')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            let data: any = change.doc.data();
            data.createdAt = data.createdAt.toDate();
            setMessages((prevMessage) => GiftedChat.append(prevMessage, data));
          }
        })
      })
  }, []);

  function onSend(messages: IMessage[]) {
    firestore()
      .collection('chatId')
      .doc(Date.now().toString())
      .set(messages[0]);
  }

  return (
    <View style={styles.chat}>
      <GiftedChat messages={messages} onSend={(messages) => onSend(messages)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    marginBottom: 30,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
  },
  chat: {
    flex: 1,
    backgroundColor: '#fff'
  },
});