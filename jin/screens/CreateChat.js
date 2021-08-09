import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'

export default function CreateChat({ navigation }) {
  const [roomName, setRoomName] = useState('')

  function handleButtonPress() {
    if (roomName.length > 0) {
      firestore()
        .collection('Chat')
        .add({
            name: roomName,
            latestMessage: {
                text: roomName + ' 채팅방이 생성되었습니다.',
                createdAt: new Date().getTime()
            }
        })
        .then(docRef => {
            docRef.collection('Messages').add({
                text: roomName + ' 채팅방이 생성되었습니다.',
                createdAt: new Date().getTime(),
                system: true,
            })
            navigation.navigate('채팅');
        })
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder='채팅방 이름'
        onChangeText={roomName => setRoomName(roomName)}
      />
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>채팅방 만들기</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#2196F3',
    textAlign: 'center',
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18
  },
  textInput: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#aaa',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 5,
    width: 225
  }
})