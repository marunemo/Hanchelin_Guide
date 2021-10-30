import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeBaseProvider, Modal, Button, Image } from 'native-base';
import { DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import Text from '../defaultSetting/FontText';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Chat from './screens/Chat';

const Drawer = createDrawerNavigator();

function DrawerMenu(props) {
  const user = auth().currentUser;
  let joinUserList = [];

  for (const joinItem of props.joinUser) {
    joinUserList.push(
      <View
        id={joinItem.id}
        style={styles.joinUserView}
      >
        <Image
        style={styles.profileImage}
          source={{
            uri: joinItem.profile,
          }}
          alt="err"
          size={8}
          resizeMode={"contain"}
      borderRadius={100}
        />
        <Text style={styles.joinUserName}>
          {joinItem.name}
        </Text>
      </View>
    )
  }

  function joinOrder() {
    firestore()
      .collection('Chat')
      .doc(props.chatRoomQuery)
      .collection('Join')
      .add({
        uid: user?.uid,
        name: user?.displayName,
        profile: user?.photoURL,
      })
  }

  function outOrder() {
    firestore()
      .collection('Chat')
      .doc(props.docId)
      .collection('Join')
      .add({
        uid: user?.uid,
        name: user?.displayName,
        profile: user?.photoURL,
      })
  }

  return (
    <DrawerContentScrollView
      style={styles.drawerContainer}
      {...props}
    >
      <NativeBaseProvider>
        <Text style={styles.joinHeader}>
          같이 배달 신청자
        </Text>
        <View style={styles.joinList}>
          {joinUserList}
          <Button
            style={styles.deleteButton}
            onPress={joinOrder}
          >
            <Text style={styles.deleteButtonText}>
              같이배달 신청하기
            </Text>
          </Button>
        </View>
        <View>
          <Button
            style={styles.deleteButton}
          // onPress={props.onPress}
          >
            <Text style={styles.deleteButtonText}>
              배달원 모집 완료
            </Text>
          </Button>
          {(props.isOwner) &&
            <Button
              style={styles.deleteButton}
              onPress={props.onDelete}
            >
              <Text style={styles.deleteButtonText}>
                채팅방 삭제
              </Text>
            </Button>
          }
          <Button
            style={styles.deleteButton}
          // onPress={props.onPress}
          >
            <Text style={styles.deleteButtonText}>
              채팅방 나가기
            </Text>
          </Button>
        </View>
      </NativeBaseProvider>
    </DrawerContentScrollView>
  );
}

export default function ChatDrawer({ navigation, route }) {
  const user = auth().currentUser;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [joinList, setJoinList] = useState([]);

  useEffect(() => {
    const unsubscribeListener = firestore()
      .collection('Chat')
      .doc(route.params.thread._id)
      .collection('Join')
      .onSnapshot(querySnapshot => {
        const joinUser = querySnapshot.docs.map(joinData => {
          return {
            id: joinData.id,
            ...joinData.data()
          }
        });

        setJoinList(joinUser);
      });
    
    return () => unsubscribeListener();
  }, [])

  function deleteChat(id) {
    firestore()
      .collection('Chat')
      .doc(id)
      .delete().then(() => {
        setShowAuthModal(false);
        navigation.navigate("같이 배달 리스트", { screen: "같이배달리스트", params: { response: 0 } });
      })
  }

  return (
    <NativeBaseProvider>
      <Drawer.Navigator
        drawerContent={(props) => (
          <DrawerMenu
            joinUser={joinList}
            chatRoomQuery={route.params.thread._id}
            isOwner={user?.uid === route.params.thread.initialUser}
            onDelete={() => {
              navigation.dispatch(DrawerActions.closeDrawer());
              setShowAuthModal(route.params.thread);
            }}
            {...props}
          />
        )}
        screenOptions={{
          drawerPosition: 'right',
          drawerType: 'front'
        }}
      >
        <Drawer.Screen
          name="채팅방"
          component={Chat}
          initialParams={route.params}
          options={({ route }) => ({
            headerTitle: () => (
              <Text style={styles.headerTitle} bold>{route.params.thread.name}</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <Icon
                style={{ paddingHorizontal: 18 }}
                name="arrow-left"
                size={24}
                color="#fff"
                onPress={navigation.goBack}
              />
            ),
            headerRight: () => (
              // (user?.uid === route.params.thread.initialUser) &&
              <Icon
                style={{ paddingHorizontal: 18 }}
                name="bars"
                size={24}
                color="#fff"
                // onPress={() => setShowAuthModal(route.params.thread)}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              />)
          })}
        />
      </Drawer.Navigator>
      <Modal isOpen={!!showAuthModal} onClose={() => setShowAuthModal(false)}>
        <Modal.Content style={styles.modalContent}>
          <Modal.Header>정말로 채팅방을 삭제하시겠습니까?</Modal.Header>
          <Modal.Body>채팅방을 지우면 다시 되돌릴 수 없습니다. 신중히 선택해주세요.</Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost">
              <Button onPress={() => deleteChat(showAuthModal._id)}>예</Button>
              <Button onPress={() => setShowAuthModal(false)}>아니요</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5'
  },
  joinHeader: {
    fontSize: 20
  },
  joinList: {

  },
  joinUserView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    marginHorizontal: 5
  },
  joinUserName: {
    fontSize: 20
  },
  deleteButton: {
    width: '100%',
    marginVertical: 3
  },
  deleteButtonText: {
    fontSize: 20
  }
})