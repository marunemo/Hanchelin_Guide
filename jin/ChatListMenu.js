import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native'
import { useToast } from 'native-base';
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
  const toast = useToast();

  useEffect(() => {
    console.log(route.params)
    const { response } = route.params;
    if (response === 0) {
      toast.show({
        title: '삭제 완료',
        description: '채팅방이 완전히 삭제되었습니다.',
        status: 'success',
        style: { width: 320 }
      })
      navigation.setParams({ response: -1 })
    } else if (response === 1) {
      toast.show({
        title: '연장 실패',
        description: '채팅방의 연장 시간이 마감되어, 채팅방이 삭제되었습니다.',
        status: 'error',
        style: { width: 320 }
      })
      navigation.setParams({ response: -1 })
    }

  }, [route.params.response])

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