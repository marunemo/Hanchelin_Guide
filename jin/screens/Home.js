// 로그인 후 나오는 홈 화면 + Stack 네비게이터 + 채팅 선택 화면
// 합칠 때는 좀 나눠야 할것 같다.

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Authentication from './Authentication';
import Chat from './Chat';
import Profile from './Profile';
import Chatroom from './Chatroom';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function HomeScreen({ navigation }) {
    const user = auth().currentUser;
    const [reviews, setReviews] = useState('');
    const [rate, setRate] = useState(null);
    const ref = firestore().collection('가게').doc('9월애').collection('리뷰');

    async function addReview() {
        await ref.add({
            message: reviews,
            rating: rate,
            uid: user?.uid,
            // 시간은 local이지만 표기만 UTC로 되는것 같다
            createdAt: new Date(),
        });
        setReviews('');
        setRate(null);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>This is HomeScreen</Text>
            <Button title="Check User Profile" onPress={() => navigation.navigate('Profile')} />
            <Button title="Go to chatroom" onPress={() => navigation.navigate('Chatroom')} />
            <Button title="Signout" onPress={() => auth().signOut()} />
            <Text style={{ fontSize: 24, paddingTop: 20 }}>리뷰 내용</Text>
            <TextInput multiline numberOfLines={4} textAlign={'center'} style={{ borderWidth: 2, alignSelf: 'stretch' }} placeholder={'리뷰를 적어주세요'} value={reviews} onChangeText={setReviews} />
            <Text style={{ fontSize: 24, paddingTop: 10 }}>별점</Text>
            <TextInput style={{ borderWidth: 2, marginBottom: 20 }} textAlign={'center'} keyboardType={'numeric'} value={rate} onChangeText={setRate} />
            <Button title={'SUBMIT'} onPress={() => addReview()}></Button>
        </View>
    );
}

const Stack = createStackNavigator();

export default function Home() {
    return (
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Chatroom" component={Chatroom} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
    );
}