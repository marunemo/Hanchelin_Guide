import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Text from '../../defaultSetting/FontText';
import { NativeBaseProvider, Stack, HStack, Spinner } from 'native-base';
import firestore from '@react-native-firebase/firestore';

// import HeaderClassicSearchBar from "../../lib/src/HeaderClassicSearchBar/HeaderClassicSearchBar";
const [headerColor, iconActiveColor, iconInActiveColor] = ["#efefef", "#BF2A52", "#bbb"];

export default function Chatroom({ navigation, route }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(new Date().getMinutes());

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Chat')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            name: '',
            location: '',
            store: '',
            endTime: 0,
            latestMessage: { text: '' },
            ...documentSnapshot.data()
          }
        })

        setThreads(threads);
        //console.log(threads);
        if (loading) {
          setLoading(false);
        }
      })

    const refreshTimer = setInterval(() => {
      let currentMinutes = new Date().getMinutes();
      if (currentMinutes != timer)
        setTimer(currentMinutes);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(refreshTimer);
    }
  }, []);

  if (loading) {
    return (
      <NativeBaseProvider>
        <Spinner size="lg" color="gray.300" />
      </NativeBaseProvider>
    )
  } else if (!threads.length) {
    return (
      <NativeBaseProvider>
        <View style={styles.emptyView}>
          <Spinner size="sm" color="gray.500" />
          <Text style={styles.emptyText}>생성된 채팅방이 없습니다.</Text>
        </View>
      </NativeBaseProvider>
    )
  }

  function leftMinutes(deadLine) {
    const deadSecond = new Date(deadLine.seconds * 1000);
    const gracePeriod = deadSecond.getTime() + 5 * 60 * 1000;
    const currTime = new Date();
    if (currTime > gracePeriod)
      return -10;
    return (deadSecond.getHours() - currTime.getHours()) * 60 + (deadSecond.getMinutes() - currTime.getMinutes())
  }

  function isClosed(itemId, leftMin) {
    if (leftMin >= -5) {
      return true;
    }

    firestore().collection('Chat').doc(itemId).delete();
    return false;
  }

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        {/* <HeaderClassicSearchBar
          backgroundColor={headerColor}
          iconActiveColor={iconActiveColor}
          iconInactiveColor={iconInActiveColor}
          iconBool={false}
        // switchValue={this.state.switchValue}
        // onChangeText={(term) => { this.searchUpdated(term) }}
        // onPress={() => this.setState({ switchValue: !(this.state.switchValue) })}
        // TODO::필터 기능 추가하기
        /> */}
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          extraData={timer}
          renderItem={({ item }) => {
            const leftMin = leftMinutes(item.endTime);
            return (
              isClosed(item._id, leftMin) &&
              <TouchableOpacity onPress={() => navigation.navigate('메시지', { thread: item })}>
                <View style={styles.listContainer}>
                  <View style={styles.listContent}>
                    <View style={styles.listHeader}>
                      <Text style={styles.nameText}>{item.name}</Text>
                      <View style={styles.deadlineView(leftMin)}>
                        <Text style={styles.deadlineText}>{leftMin >= 0 ? +leftMin + '분 남음' : '마감'}</Text>
                      </View>
                    </View>
                    <Text style={styles.contentText}>
                      {item.latestMessage.text != undefined && item.latestMessage.text.slice(0, 90)}
                    </Text>
                    <Stack>
                      <HStack marginRight={3} alignSelf="flex-end" space={3}>
                        <Text>가게명: {item.store}</Text>
                        <Text>배달 위치: {item.location}</Text>
                      </HStack>
                    </Stack>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 28,
    fontWeight: '500'
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: 100,
    borderBottomColor: '#ededed',
    borderBottomWidth: 0.5,
    borderRadius: 15
  },
  listContent: {
    flexShrink: 1
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#000'
  },
  deadlineView: (leftMin) => ({
    backgroundColor:
      leftMin >= 10 ?
        'hsl(135, 100%, 40%)' :
        leftMin >= 0 ?
          `hsl(${135 * leftMin / 10}, 100%, 40%)` :
          '#737373'
    ,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 15,
  }),
  deadlineText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  contentText: {
    color: '#777777',
    fontSize: 16,
    marginVertical: 6,
    marginLeft: 5
  },
  emptyView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 20
  },
  emptyText: {
    fontSize: 21,
    color: '#4f4f4f',
    marginLeft: 12
  }
})