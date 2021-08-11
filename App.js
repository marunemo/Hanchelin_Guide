import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import Authentication from './jin/screens/Authentication'
import RestHome from './restaurant/RestHome.js';
import Chatroom from "./jin/screens/Chatroom.js";
import ClientId from "./android/app/google-services.json"

const BTab = createBottomTabNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId : ClientId["client"][0]["oauth_client"][2]["client_id"]
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
        <BTab.Navigator 
          tabBarOptions={{
            activeTintColor: '#fff',
            inactiveTintColor: 'lightgray',
            activeBackgroundColor: '#468966',
            inactiveBackgroundColor: '#FFF0A5',
            style: {
                backgroundColor: '#CE4418',
                paddingBottom: 3
            }
          }}>
          <BTab.Screen
            name="식당리스트"
            component={RestHome}
            options={{headerShown: false}} />
          <BTab.Screen 
              name="같이배달" 
              component={Chatroom}
              options={{headerShown: false}} />
        </BTab.Navigator>
      </NavigationContainer>
    );
  }
  
  return <Authentication onGoogleButtonPress={onGoogleButtonPress} />
  
  
}