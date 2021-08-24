import React, { Fragment, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

import Authentication from './jin/screens/Authentication'
import RestHome from './restaurant/RestHome.js';
import Chatroom from "./jin/screens/Chatroom.js";
import ClientId from "./android/app/google-services.json";

const BTab = createBottomTabNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: ClientId["client"][0]["oauth_client"][1]["client_id"]
    });
  }, []);

  async function onGoogleButtonPress() {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }

  auth().onAuthStateChanged((user) => {
    if (user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  });

  if (authenticated) {
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#BF2A52' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
          <StatusBar barStyle="light-content" />
          <NavigationContainer>
            <BTab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                  let iconName, iconColor;
                  if (route.name == '식당') {
                    iconName = 'cutlery';
                  } else if (route.name == '같이 배달') {
                    iconName = 'automobile';
                  }
                  if (focused) {
                    iconColor = '#BF2A52';
                  } else {
                    iconColor = '#aaa';
                  }
                  return <Icon name={iconName} size={24} color={iconColor} />;
                },
                tabBarActiveTintColor: '#BF2A52',
                tabBarInactiveTintColor: '#aaa',
                tabBarActiveBackgroundColor: '#fefefe',
                tabBarInactiveBackgroundColor: '#fefefe',
                tabBatShowLabel: true
              })}>
              <BTab.Screen
                name='식당'
                component={RestHome}
                options={{ headerShown: false }} />
              <BTab.Screen
                name='같이 배달'
                component={Chatroom}
                options={{ headerShown: false }} />
            </BTab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </Fragment>
    );
  }

  return <Authentication onGoogleButtonPress={onGoogleButtonPress} />

}