import React from 'react';
import { StyleSheet } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Text from '../defaultSetting/FontText';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

import Chat from './screens/Chat';

const Drawer = createDrawerNavigator();

export default function ChatDrawer({ route }) {
  const user = auth().currentUser;

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right'
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
          animation: 'fade_from_bottom',
          headerRight: () => (
            (user?.uid === route.params.thread.initialUser) &&
            <Icon name="trash" size={24} color="#fff"
              onPress={() => setShowAuthModal(route.params.thread)}
            />)
        })}
      />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    color: '#f5f5f5'
  }
})