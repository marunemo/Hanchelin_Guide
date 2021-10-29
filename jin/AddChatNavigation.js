import React from 'react';
import { StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Text from '../defaultSetting/FontText';

import CreateChat from './screens/CreateChat';

const Stack = createNativeStackNavigator();

export default function CreateChatNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="채팅방 생성창"
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
        }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5'
  }
})