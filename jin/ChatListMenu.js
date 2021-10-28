import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ChatRoom from './screens/Chatroom';

const Drawer = createDrawerNavigator();

export default function ChatRoomDrawer({ route }) {
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerPosition: 'left'
        }}
      >
        <Drawer.Screen
          name="메시지 화면"
          component={ChatRoom}
          initialParams={{ response: -1 }}
        // options={({ route }) => ({
        //   headerTitle: () => (
        //     <Text style={styles.headerTitle} bold>{route.params.thread.name}</Text>
        //   ),
        //   headerBackTitleVisible: false,
        //   headerStyle: {
        //     backgroundColor: '#BF2A52',
        //   },
        //   headerTintColor: '#fff',
        //   headerTitleAlign: 'center',
        //   animation: 'fade_from_bottom',
        //   headerRight: () => (
        //     (user?.uid === route.params.thread.initialUser) &&
        //     <Icon name="trash" size={24} color="#fff"
        //       onPress={() => setShowAuthModal(route.params.thread)}
        //     />
        //   )
        // })}
        />
      </Drawer.Navigator>
    )
  }