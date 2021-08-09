import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RestHome from './restaurant/RestHome.js';
import DeliverScreen from './restaurant/DeliverScreen.js';

const BTab = createBottomTabNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <BTab.Navigator 
        tabBarOptions={{
          activeTintColor: '#fff',
          inactiveTintColor: 'lightgray',
          activeBackgroundColor: '#A57873',
          inactiveBackgroundColor: '#5B5853',
          style: {
              backgroundColor: '#CE4418',
              paddingBottom: 3
          }
        }}>
        <BTab.Screen
          name="식당리스트"
          component={RestHome}
          options={{headerShown : false}} />
        <BTab.Screen
          name="같이배달"
          component={DeliverScreen}
          options={{headerShown : false}} />
      </BTab.Navigator>
    </NavigationContainer>
  );
}