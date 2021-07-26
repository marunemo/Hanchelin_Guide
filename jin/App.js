// 제 컴퓨터에서 안 돌아가서 일단 코드만 올려놓습니다.
// google signin에 대한 코드가 있다. 그냥 이메일 로그인도 넣을까 생각중
// build.gradle 등에 더 넣어야 할 코드들은 추가 예정

import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import Authentication from './screens/Authentication';
import Chat from './screens/Chat';
import Main from './screens/Main';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
    const [authenticated, setAuthenticated] = useState(false);

    // webClientId는 firebase에서 다운받은 google.services.json에서 가져오면 된다
    // client -> oauth_client -> client_id에 있는 걸 복붙
    useEffect(() => {
      GoogleSignin.configure({
        webClientId:
          'WEB_CLIENT_ID',
      });
    }, []);

    async function onGoogleButtonPress() {
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    }

    // 유저 로그인 상태 체크
    auth().onAuthStateChanged((user) => {
      if(user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });

    // 유저가 로그인 상태면 Main으로, 아니면 로그인 페이지를 보여준다.
    if (authenticated) {
      return (
        <NavigationContainer>
          {
            <Main />
          }
        </NavigationContainer>
      )
    }

    return <Authentication onGoogleButtonPress={onGoogleButtonPress} />
}