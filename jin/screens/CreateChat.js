import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { NativeBaseProvider, Text, Input, Button } from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CreateChat({ route, navigation }) {
  const user = auth().currentUser
  const [roomName, setRoomName] = useState('') //채팅방 이름
  const [storeName, setStoreName] = useState(route.params?.restName ? route.params.restName : '') //식당이름
  const [delivLocation, setDelivLocation] = useState('') //배달위치
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 10 * 60 * 1000)) //모집 마감시간
                                                                // 1000 밀리초 * 10초 * 10분 
  const [modalVisible, setModalVisible] = useState(false)

  function handleButtonPress() {
    if (roomName.length > 0) {
      firestore()
        .collection('Chat')
        .add({
            name: roomName,
            store: storeName,
            location: delivLocation,
            endTime: endTime,
            initialUser: user?.uid,
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
            navigation.navigate('같이 배달 리스트');
        })
    }
  }

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Input
          bg='white'
          minWidth={230}
          marginTop='3'
          placeholder='식당 이름'
          value={storeName}
          onChangeText={setStoreName}
        />
        <Input
          bg='white'
          minWidth={230}
          marginTop='3'
          placeholder='채팅방 이름'
          onChangeText={setRoomName}
        />
        <Input 
          bg='white'
          minWidth={230}
          marginTop='3'
          placeholder='배달 위치'
          onChangeText={setDelivLocation}
        />
        <Button 
          bg='grey'
          minWidth={230}
          marginTop='3'
          textAlign="center"
          onPress={() => setModalVisible(true)}
        >
          {endTime.getHours() + " : " + endTime.getMinutes()}
        </Button>
        <DateTimePickerModal
          mode="time"
          date={endTime}
          isVisible={modalVisible}
          onConfirm={endTime => {
            setEndTime(endTime);
            setModalVisible(false);
          }}
          onCancel={() => setModalVisible(false)}
        />
        <Button style={styles.button} onPress={handleButtonPress} bg='#BF2A52'>
          <Text style={{ color: 'white', fontWeight: 'bold'}}>채팅방 만들기</Text>
        </Button>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#BF2A52',
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
})