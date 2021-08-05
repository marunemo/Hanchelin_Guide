// 구글 로그인과 네비게이션 기능들이 모여있음

import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import Authentication from './screens/Authentication';
import Chat from './screens/Chat';
import Profile from './screens/Profile';
import Home from './screens/Home';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
    const [authenticated, setAuthenticated] = useState(false);

    // google-services.json에서 webClientId를 가져올때 client-type이 3인 것의 id를 가져와야 한다
    useEffect(() => {
      GoogleSignin.configure({
        webClientId:
          '503246918945-graj2onlcd6t613vei4ti07s2s3g6u1p.apps.googleusercontent.com',
      });
    }, []);

    async function onGoogleButtonPress() {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    }

    auth().onAuthStateChanged((user) => {
      if(user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });

    if (authenticated) {
      return (
        <NavigationContainer>
          {
            <Home />
          }
        </NavigationContainer>
      )
    }

    return <Authentication onGoogleButtonPress={onGoogleButtonPress} />
}