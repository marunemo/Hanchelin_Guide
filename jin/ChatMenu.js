import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Modal, Button } from 'native-base';
import { DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Text from '../defaultSetting/FontText';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Chat from './screens/Chat';

const Drawer = createDrawerNavigator();

export default function ChatDrawer({ navigation, route }) {
  const user = auth().currentUser;
  const [showAuthModal, setShowAuthModal] = useState(false);

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
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5'
  }
})