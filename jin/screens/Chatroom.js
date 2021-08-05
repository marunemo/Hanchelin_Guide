import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Authentication from './Authentication';
import Chat from './Chat';
import Profile from './Profile';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Chatroom({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>새로운 채팅을 시작해보세요</Text>
            <Button title="채팅 만들기" onPress={() => navigation.navigate('Chat')} />
        </View>
    );
}