import React, { useState } from 'react'
import { View, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native'
import { NativeBaseProvider, Text, Input, Button, Select } from 'native-base'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import DateTimePicker from '@react-native-community/datetimepicker'

export default function CreateChat({ navigation }) {
  const user = auth().currentUser
  const [roomName, setRoomName] = useState('기본 채팅방') //채팅방 이름
  const [storeName, setStoreName] = useState('기본 식당이름') //식당이름
  const [delivLocation, setDelivLocation] = useState('기본 배달위치') //배달위치
  const [endTime, setEndTime] = useState(0) //모집 마감시간

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
      <View style={styles.container}>
        <Select 
          style={styles.select}
          placeholder='식당 이름'
          accessibilityLabel='식당 이름'
          minWidth={230}
          bg='white'
          onValueChange={itemValue => setStoreName(itemValue)}  
        >
          <Select.Item label='9월애' value='9월애' />
          <Select.Item label='호원' value='호원' />
        </Select>
        <Input
          bg='white'
          minWidth={230}
          marginTop='3'
          placeholder='채팅방 이름'
          onChangeText={roomName => setRoomName(roomName)}
        />
        <Input 
          bg='white'
          minWidth={230}
          marginTop='3'
          placeholder='배달 위치'
          onChangeText={delivLocation => setDelivLocation(delivLocation)}
        />
        <Input
          bg='white'
          minWidth={230}
          marginTop='3'
          placeholder='모집 마감시간'
          onChangeText={(endTime) => setEndTime(parseInt(endTime))}
        />
        <Button style={styles.button} onPress={handleButtonPress} bg='#BF2A52'>
          <Text style={{ color: 'white', fontWeight: 'bold'}}>채팅방 만들기</Text>
        </Button>
      </View>
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
  select: {
    paddingBottom: 10
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