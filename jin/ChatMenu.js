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
        key={joinItem.id}
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
        <Text style={[styles.joinUserName, joinItem.uid === user.uid && { color: '#881337' }]}>
          {joinItem.name}
        </Text>
      </View>
    )
  }

  function joinOrder() {
    if (user) {
      firestore()
        .collection('Chat')
        .doc(props.chatRoomQuery)
        .collection('Join')
        .doc(user.uid)
        .set({
          uid: user?.uid,
          name: user?.displayName,
          profile: user?.photoURL,
        });
    } else {
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
  }

  function outOrder() {
    if (user) {
      firestore()
        .collection('Chat')
        .doc(props.chatRoomQuery)
        .collection('Join')
        .doc(user.uid)
        .delete();
    } else {
      for (const joinItem of props.joinUser) {
        if (joinItem.uid == user.uid) {
          firestore()
            .collection('Chat')
            .doc(props.chatRoomQuery)
            .collection('Join')
            .doc(joinItem.id)
            .delete();
        }
      }
    }
  }

  function isJoined() {
    for (const joinItem of props.joinUser) {
      if (joinItem.uid == user.uid) {
        return true;
      }
    }
    return false;
  }

  return (
    <NativeBaseProvider>
      <DrawerContentScrollView
        style={styles.drawerContainer}
        {...props}
      >
        <View style={{ paddingBottom: 3, borderBottomWidth: 1 }}>
          <Text style={styles.joinHeader}>
            ?????? ?????? ?????????
          </Text>
        </View>
        <View style={styles.joinList}>
          <View style={styles.joinUserListView}>
            {joinUserList}
          </View>
          {isJoined()
            ? <Button
              style={styles.drawerButton}
              variant="solid"
              colorScheme="error"
              onPress={outOrder}
            >
              <Text style={styles.outButtonText}>
                ???????????? ????????????
              </Text>
            </Button>
            : <Button
              style={styles.drawerButton}
              variant="solid"
              colorScheme="success"
              onPress={joinOrder}
            >
              <Text style={styles.joinButtonText}>
                ???????????? ????????????
              </Text>
            </Button>}
          {(props.isOwner) &&
            <Button
              style={styles.drawerButton}
              variant="solid"
              colorScheme="info"
            // onPress={props.onPress}
            >
              <Text style={styles.completeButtonText}>
                ????????? ?????? ??????
              </Text>
            </Button>}
        </View>
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        {(props.isOwner) &&
          <Button
            style={styles.drawerButton}
            variant="outline"
            colorScheme="danger"
            onPress={props.onDelete}
          >
            <Text style={styles.deleteButtonText}>
              ????????? ??????
            </Text>
          </Button>
        }
        <Button
          style={styles.drawerButton}
          variant="solid"
          colorScheme="warning"
          onPress={props.onExit}
        >
          <Text style={styles.exitButtonText}>
            ????????? ?????????
          </Text>
        </Button>
      </View>
    </NativeBaseProvider>
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
        navigation.navigate("?????? ?????? ?????????", { response: 0 });
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
            onExit={navigation.goBack}
            {...props}
          />
        )}
        screenOptions={{
          drawerPosition: 'right',
          drawerType: 'front'
        }}
      >
        <Drawer.Screen
          name="?????????"
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
          <Modal.Header>????????? ???????????? ?????????????????????????</Modal.Header>
          <Modal.Body>???????????? ????????? ?????? ????????? ??? ????????????. ????????? ??????????????????.</Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost">
              <Button onPress={() => deleteChat(showAuthModal._id)}>???</Button>
              <Button onPress={() => setShowAuthModal(false)}>?????????</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: '#efefef',
    padding: 15
  },
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5'
  },
  joinHeader: {
    fontSize: 20
  },
  joinList: {
    marginBottom: 10
  },
  joinUserView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  joinUserListView: {
    marginVertical: 10
  },
  profileImage: {
    marginHorizontal: 5
  },
  joinUserName: {
    fontSize: 14
  },
  drawerButton: {
    width: '100%',
    marginVertical: 3
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16
  },
  outButtonText: {
    color: '#fff',
    fontSize: 16
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16
  },
  deleteButtonText: {
    color: '#e11d48',
    fontSize: 16
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16
  },
  drawerFooter: {
    backgroundColor: '#efefef',
    paddingVertical: 3,
    paddingHorizontal: 15
  }
})