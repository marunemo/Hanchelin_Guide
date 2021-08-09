import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Authentication from './jin/screens/Authentication'
import RestHome from './restaurant/RestHome.js';
import DeliverScreen from './restaurant/DeliverScreen.js';

const BTab = createBottomTabNavigator();

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

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
        <BTab.Navigator tabBarOptions={{activeTintColor: "black" , inactiveTintColor: 'gray'}}>
          <BTab.Screen name="식당리스트" component={RestHome}/>
          <BTab.Screen name="같이배달" component={DeliverScreen}/>
        </BTab.Navigator>
      </NavigationContainer>
    );
  }
  
  return <Authentication onGoogleButtonPress={onGoogleButtonPress} />
  
  
}