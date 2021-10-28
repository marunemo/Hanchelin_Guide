import React from 'react';
import { StyleSheet } from 'react-native';
import Text from '../defaultSetting/FontText';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatRoom from './ChatListMenu';
import Chat from './ChatMenu';
import CreateChat from './screens/CreateChat';

const StackNav = createNativeStackNavigator();

export default function ({ navigation }) {
    return (
      <StackNav.Navigator
        // screenOptions={{ headerShown: false }}
      >
        <StackNav.Screen
          name="같이 배달 리스트"
          component={ChatRoom}
        />
        <StackNav.Screen
          name="새로운 채팅방 만들기"
          component={CreateChat}
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle} bold>{"새로운 채팅방 만들기"}</Text>
            ),
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#BF2A52',
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            animation: 'slide_from_right'
          }}
        />
        <StackNav.Screen
          name="메시지"
          component={Chat}
        />
      </StackNav.Navigator>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    minWidth: 100,
    maxWidth: 250,
    minHeight: 100,
    maxHeight: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5'
  }
})