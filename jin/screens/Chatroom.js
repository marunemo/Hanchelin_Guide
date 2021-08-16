import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Divider, NativeBaseProvider } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Authentication from './Authentication';
import CreateChat from "./CreateChat";
import Chat from "./Chat";

const Stack = createNativeStackNavigator();

function Chatroom({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Chat')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            latestMessage: { text: '' },
            ...documentSnapshot.data()
          }
        })

        setThreads(threads);
        console.log(threads);
        if (loading) {
          setLoading(false);
        }
      })

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('메시지', { thread: item })}>
              <View style={styles.row}>
                <View style={styles.content}>
                  <View style={styles.header}>
                    <Text style={styles.nameText}>{item.name}</Text>
                  </View>
                  <Text style={styles.contentText}>
                    {item.latestMessage.text != undefined && item.latestMessage.text.slice(0, 90)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Divider bg='black' />}
        />
      </View>
    </NativeBaseProvider>
  );
}

export default function ({ navigation }) {
  return (
    <NativeBaseProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="같이 배달 리스트"
          component={Chatroom}
          options={{
            title: '같이 배달',
            headerStyle: {
              backgroundColor: '#468966',
            },
            headerTintColor: '#f2f2f2',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            },
            headerRight: () => (
              <Icon name="plus" size={24} color="#f2f2f2"
                onPress={() => navigation.navigate('새로운 채팅방 만들기')} />
            )
          }}
        />
        <Stack.Screen
          name="새로운 채팅방 만들기"
          component={CreateChat}
          options={{
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#468966',
            },
            headerTintColor: '#f2f2f2',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            }
          }}
        />
        <Stack.Screen
          name="메시지"
          component={Chat}
          options={({ route }) => ({
            title: route.params.thread.name,
            headerBackTitleVisible: false,
            headerStyle: {
              backgroundColor: '#468966',
            },
            headerTintColor: '#f2f2f2',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 20,
            }
          })}
        />
      </Stack.Navigator>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500'
  },
  row: {
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    flexShrink: 1
  },
  header: {
    flexDirection: 'row'
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000'
  },
  dateText: {},
  contentText: {
    color: '#949494',
    fontSize: 16,
    marginTop: 2
  }
})