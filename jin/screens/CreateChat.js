import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, StyleSheet, Platform, View } from 'react-native';
import { NativeBaseProvider, Text, Input, Button, useToast } from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CreateChat({ route, navigation }) {
  const user = auth().currentUser
  const toast = useToast()
  const [roomName, setRoomName] = useState('') //채팅방 이름
  const [storeName, setStoreName] = useState(route.params?.restName ? route.params.restName : '') //식당이름
  const [delivLocation, setDelivLocation] = useState('') //배달위치
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 10 * 60 * 1000)) //모집 마감시간 (1000 밀리초 * 10초 * 10분)
  const [modalVisible, setModalVisible] = useState(false)

  function handleButtonPress() {
    const toastSetting = { title: '주의', status: 'error', isClosable: false, style: { width: 320 } }

    if (roomName === '') {
      toast.show({ description: '채팅방 이름이 작성되지 않았습니다!', ...toastSetting })
    } else if (storeName === '') {
      toast.show({ description: '식당 이름이 작성되지 않았습니다!', ...toastSetting })
    } else if (delivLocation === '') {
      toast.show({ description: '배달 위치가 정해지지 않았습니다!', ...toastSetting })
    } else if ((endTime - new Date()) < 0) {
      toast.show({ description: '마감 시간이 현재 시간보다 전에 있습니다!', ...toastSetting })
    } else {
      const chatThread = {
        name: roomName,
        store: storeName,
        location: delivLocation,
        initialUser: user?.uid,
        latestMessage: {
          text: roomName + ' 채팅방이 생성되었습니다.',
          createdAt: new Date().getTime()
        }
      }

      firestore()
        .collection('Chat')
        .add({ endTime: endTime, ...chatThread })
        .then(docRef => {
          docRef.collection('Messages').add({
            text: roomName + ' 채팅방이 생성되었습니다.',
            createdAt: new Date().getTime(),
            system: true,
          })
          navigation.goBack();
          navigation.navigate('메시지', { thread: { _id: docRef.id, ...chatThread } });
        })
    }
  }

  return (
    <NativeBaseProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Input
              bg='white'
              minWidth={230}
              marginTop='3'
              placeholder='식당 이름'
              returnKeyType='done'
              value={storeName}
              onChangeText={setStoreName}
            />
            <Input
              bg='white'
              minWidth={230}
              marginTop='3'
              returnKeyType='done'
              placeholder='채팅방 이름'
              onChangeText={setRoomName}
            />
            <Input
              bg='white'
              minWidth={230}
              marginTop='3'
              returnKeyType='done'
              placeholder='배달 위치'
              onChangeText={setDelivLocation}
            />
            <Button
              bg='white'
              minWidth={230}
              marginTop='3'
              variant="outline"
              onPress={() => setModalVisible(true)}
              _text={{
                textAlign: 'center',
                fontSize: 18,
                color: '#333333'
              }}
            >
              {(endTime.getHours() < 10 ? '0' : '') + endTime.getHours() + " : " +
                (endTime.getMinutes() < 10 ? '0' : '') + endTime.getMinutes()}
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
              <Text style={{ color: 'white', fontWeight: 'bold' }}>채팅방 만들기</Text>
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
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