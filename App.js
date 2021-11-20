import React, { Fragment, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Text from './defaultSetting/FontText'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

import Authentication from './jin/screens/Authentication';
import RestHome from './restaurant/RestHome.js';
// import Chatroom from "./jin/screens/Chatroom.js";
import Chatroom from "./jin/ChatNavigator";
import ClientId from "./android/app/google-services.json";
//import SecureKey from "./defaultSetting/secure.json";

const BTab = createBottomTabNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [inProgress, setProgress] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: ClientId["client"][0]["oauth_client"][3]["client_id"]
    });
  }, []);

  /*const linking = {
    prefixes: ['kakao{' + SecureKey.kakaonative + '}://'],
    config: {
      screens: {
        '식당 정보': 'kakaolink'
      },
    },
  };*/

  async function onGoogleButtonPress() {
    setProgress(true);
    try {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
      setProgress(false);
    }
  }

  auth().onAuthStateChanged((user) => {
    if (user) {
      setAuthenticated(true);
      setProgress(false);
    } else {
      setAuthenticated(false);
    }
  });

  if (authenticated) {
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#BF2A52' }} />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#efefef' }}>
          <StatusBar barStyle="light-content" />
          <NavigationContainer>
            <BTab.Navigator
              screenOptions={({ route }) => ({
                tabBarLabel: ({ focused }) => {
                  return <Text style={focused ? styles.focusLabel : styles.unfocusLabel}>{route.name}</Text>
                },
                tabBarIcon: ({ focused }) => {
                  let iconName;
                  if (route.name == '식당') {
                    iconName = 'cutlery';
                  } else if (route.name == '같이 배달') {
                    iconName = 'automobile';
                  }
                  if (focused) {
                    return <Icon name={iconName} size={20} color="#BF2A52" />;
                  } else {
                    return <Icon name={iconName} size={16} color="#aaa" />;
                  }
                },
                tabBarStyle: {
                  height: '8%',
                  backgroundColor: '#efefef',
                  paddingTop: 7,
                  paddingBottom: 7
                },
                tabBarActiveBackgroundColor: '#efefef',
                tabBarInactiveBackgroundColor: '#efefef',
                tabBarHideOnKeyboard: true
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

  return <Authentication onGoogleButtonPress={onGoogleButtonPress} disabled={inProgress} />

}

const styles = StyleSheet.create({
  focusLabel: {
    fontSize: 14,
    color: '#bf2a52',
    fontFamily: 'ELANDChoiceB',
  },
  unfocusLabel: {
    fontSize: 12,
    color: '#aaaaaa',
    fontFamily: 'ELANDchoiceM'
  }
})