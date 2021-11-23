import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  SafeAreaView
} from 'react-native';
import {
  NativeBaseProvider,
  Input,
  Button,
  useToast
} from 'native-base';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { createFilter } from 'react-native-search-filter';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Text from '../../defaultSetting/FontText';

const KEYS_TO_FILTERS = ['name'];

export default function CreateChat({ route, navigation }) {
  const user = auth().currentUser
  const toast = useToast()
  const [roomName, setRoomName] = useState('') //채팅방 이름
  const [storeName, setStoreName] = useState(route.params?.restFullName ? route.params.restFullName : '') //식당이름
  const [delivLocation, setDelivLocation] = useState('') //배달위치
  const [endTime, setEndTime] = useState(new Date(new Date().getTime() + 10 * 60 * 1000)) //모집 마감시간 (1000 밀리초 * 10초 * 10분)
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const [restNameList, setRestList] = useState([])
  const [searchModalVisible, setSearchModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    let restDataList = [];
    database().ref('/식당').once('value').then(restData => {
      if (restData) {
        restData.val().map(restDataItem => {
          restDataList.push({ id: restDataItem['id'], name: restDataItem['name'], category: restDataItem['category'] });
        })
      }
    })
    setRestList(restDataList);

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  function FilteredRestList(props) {
    const restList = props.restList;
    if (restList.length === 0) {
      return (
          <Text style={styles.emptyText}>검색된 식당이 없습니다</Text>
      )
    } else {
      return (
        <ScrollView keyboardDismissMode="on-drag">
          {restList.map(restName => {
            return (
              <TouchableOpacity
                key={restName.id}
                onPress={() => {
                  setStoreName(restName.name);
                  setSearchModalVisible(false);
                }}
              >
                <View style={styles.restListItem}>
                  <Text style={styles.restListName} bold>{restName.name}</Text>
                  <Text style={styles.restListCategory}>{restName.category}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      )
    }
  }

  function handleButtonPress() {
    const toastSetting = { title: '주의', status: 'error', isClosable: false, style: { width: 320 } }

    if (storeName === '') {
      toast.show({ description: '식당 이름이 작성되지 않았습니다!', ...toastSetting })
    } else if (delivLocation === '') {
      toast.show({ description: '배달 위치가 정해지지 않았습니다!', ...toastSetting })
    } else if ((endTime - new Date()) < 0) {
      toast.show({ description: '마감 시간이 현재 시간보다 전에 있습니다!', ...toastSetting })
    } else {
      const chatThread = {
        name: roomName !== '' ? roomName : route.params === undefined ? storeName + ' 같이 주문해요' : route.params.restName + ' 같이 주문해요',
        store: storeName,
        location: delivLocation,
        initialUser: user?.uid,
        latestMessage: {
          text: '채팅방이 생성되었습니다.',
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
          docRef
            .collection('Join')
            .doc(user.uid)
            .set({
              uid: user?.uid,
              name: user?.displayName,
              profile: user?.photoURL,
            });
          navigation.goBack();
          navigation.navigate('메시지', { thread: { _id: docRef.id, endTime: { seconds: endTime.getTime() / 1000 }, ...chatThread } });
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
            <View style={styles.labelLayout}>
              <Text style={styles.inputLabel}>식당 이름</Text>
            </View>
            <Button
              bg='white'
              borderColor="muted.200"
              width={230}
              marginBottom='3'
              justifyContent="flex-start"
              variant="outline"
              value={storeName}
              onPress={() => setSearchModalVisible(true)}
              _text={{
                color: '#333333'
              }}
            >
              {storeName === '' ? ' ' : storeName}
            </Button>
            <View style={styles.labelLayout}>
              <Text style={styles.inputLabel}>채팅방 이름</Text>
            </View>
            <Input
              bg='white'
              width={230}
              marginBottom='3'
              returnKeyType='done'
              placeholder={route.params !== undefined ? route.params.restName + ' 같이 주문해요' : storeName === '' ? '' : storeName + ' 같이 주문해요'}
              onChangeText={setRoomName}
            />
            <View style={styles.labelLayout}>
              <Text style={styles.inputLabel}>배달 위치</Text>
            </View>
            <Input
              bg='white'
              width={230}
              marginBottom='3'
              returnKeyType='done'
              placeholder='배달 위치'
              onChangeText={setDelivLocation}
            />
            <View style={styles.labelLayout}>
              <Text style={styles.inputLabel}>마감 시간</Text>
            </View>
            <Button
              bg='white'
              borderColor="muted.200"
              width={230}
              marginBottom='3'
              variant="outline"
              onPress={() => setDateModalVisible(true)}
              _text={{
                fontSize: 18,
                color: '#333333'
              }}
            >
              {(endTime.getHours() < 10 ? '0' : '') + endTime.getHours() + " : " +
                (endTime.getMinutes() < 10 ? '0' : '') + endTime.getMinutes()}
            </Button>
            <Modal
              animationIn="zoomInDown"
              animationOut="zoomOutUp"
              useNativeDriver={true}
              useNativeDriverForBackdrop={true}
              hideModalContentWhileAnimating={true}
              backdropTransitionInTiming={0}
              backdropTransitionOutTiming={0}
              isVisible={searchModalVisible}
              onBackButtonPress={() => setSearchModalVisible(false)}
              onBackdropPress={isKeyboardVisible ? Keyboard.dismiss : (() => setSearchModalVisible(false))}
            >
              <SafeAreaView style={styles.searchModal}>
                <Input
                  style={styles.searchBox}
                  returnKeyType="search"
                  placeholder="검색할 식당 이름을 입력해주세요"
                  onChangeText={setSearchText}
                  _focus={{
                    borderColor: '#BF2A52'
                  }}
                />
                <FilteredRestList restList={restNameList.filter(createFilter(searchText, KEYS_TO_FILTERS))} />
              </SafeAreaView>
            </Modal>
            <DateTimePickerModal
              mode="time"
              date={endTime}
              isVisible={dateModalVisible}
              onConfirm={endTime => {
                setEndTime(endTime);
                setDateModalVisible(false);
              }}
              onCancel={() => setDateModalVisible(false)}
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
  labelLayout: {
    width: 230,
    marginBottom: 3,
    paddingLeft: 5
  },
  inputLabel: {
    fontSize: 15
  },
  searchModal: {
    height: '70%',
    backgroundColor: '#fff',
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderRadius: 20
  },
  searchBox: {
    padding: 10,
    marginBottom: 10
  },
  restListItem: {
    borderColor: '#737373',
    borderBottomWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 5
  },
  restListName: {
    fontSize: 14,
    marginBottom: 3
  },
  restListCategory: {
    color: '#333',
    fontSize: 12,
    marginLeft: 3
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 30,
  }
})