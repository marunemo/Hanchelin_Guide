// User 정보와 Chat으로의 navigation이 있는 페이지

import React from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Authenticated from './Authenticated';

export default function Main (props, { navigation }) {
    const user = auth().currentUser;
    const Stack = createStackNavigator();

    return (
        <View style={styles.screen}>
            <Button title="Go to chatroom" onPress={() => navigation.navigate('Authenticated')} />
            <Text style={styles.title}>You're Logged In</Text>
            <Image source={{ uri: user?.photoURL }} style={styles.image} />
            <Text style={styles.text}>{user?.displayName}</Text>
            <Text style={styles.text}>{user?.email}</Text>
            <View style={{ marginTop: 30 }}>
                <Button title="Signout" onPress={() => auth().signOut()} />
            </View>
        </View>  
    );
}

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 25,
      marginBottom: 30,
    },
    image: {
      height: 150,
      width: 150,
      borderRadius: 150,
      marginBottom: 20,
    },
    text: {
      fontSize: 20,
    },
});