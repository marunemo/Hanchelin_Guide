import React from 'react';
import { View, StyleSheet } from 'react-native'
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import Text from '../defaultSetting/FontText';
import Icon from 'react-native-vector-icons/FontAwesome';

import ChatRoom from './screens/Chatroom';

const Drawer = createDrawerNavigator();

function DrawerMenu(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View>
        <Text>Temp</Text>
      </View>
    </DrawerContentScrollView>
  );
}

export default function ChatRoomDrawer({ navigation, route }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerMenu {...props} />}
      screenOptions={{
        drawerPosition: 'left'
      }}
    >
      <Drawer.Screen
        name="같이배달리스트"
        component={ChatRoom}
        initialParams={{ response: -1 }}
        options={{
          headerTitle: () => (
            <Text style={styles.headerTitle} bold>같이 배달</Text>
          ),
          headerStyle: {
            backgroundColor: '#BF2A52',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerLeft: () => (<></>),
          headerRight: () => (
            <Icon
              style={{ paddingHorizontal: 18 }}
              name="plus"
              size={24}
              color="#fff"
              onPress={() => navigation.navigate('새로운 채팅방 만들기')} />
          )
        }}
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