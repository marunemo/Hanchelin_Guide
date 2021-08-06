import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListScreen from './restaurant/ListScreen.js';
import RestHome from './restaurant/RestHome.js';
import DiliverScreen from './restaurant/DiliverScreen.js';

const BTab = createBottomTabNavigator();

export default function App() {
  
  return (
    <NavigationContainer>
      <BTab.Navigator tabBarOptions={{activeTintColor: "black" , inactiveTintColor: 'gray'}}>
      {/* <BTab.Screen name="식당리스트" component={ListScreen}/> */}
      <BTab.Screen name="식당리스트" component={RestHome}/>
      <BTab.Screen name="같이배달" component={DiliverScreen}/>

      {/* <BTab.Screen name="테스트데이터" component={DataBox}/> */}
      </BTab.Navigator>
    </NavigationContainer>
  );
}