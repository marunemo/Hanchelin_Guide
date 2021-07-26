import React, { Component } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { NativeBaseProvider, Center, Box } from 'native-base';
import firebase from '@react-native-firebase/database';

res = "9월애"

class Home extends Component {
  render() {
    return (
      <View style={styles.eachView} >
        <Text> 식당을 선택하세요.</Text>
        <Button
          title="9월애"
          onPress={() => {res = "9월애"; this.props.navigation.navigate('Res')}}
        />
        <Button
          title="도르리식당"
          onPress={() => {res = "도르리식당"; this.props.navigation.navigate('Res')}}
        />
        <Button
          title="욱이네식당"
          onPress={() => {res = "욱이네식당"; this.props.navigation.navigate('Res')}}
        />
        <Button
          title="호식이두마리치킨"
          onPress={() => {res = "호식이두마리치킨"; this.props.navigation.navigate('Res')}}
        />
        <Button
          title="챗 화면으로 가기"
          onPress={() => this.props.navigation.navigate('Chat')}
        />
        <Button
          title="세팅 화면으로 가기"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
      </View>
    )
  }
}

class Chat extends Component {
  render() {
    return (
      <View style={styles.eachView} >
        <Text> 챗 화면 입니다.</Text>
        <Button
          title="홈 화면으로 가기"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    )
  }
}

class Settings extends Component {
  render() {
    return (
      <View style={styles.eachView} >
        <Text> 세팅 화면 입니다.</Text>
        <Button
          title="홈 화면으로 가기"
          onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    )
  }
}

class Res extends Component {

  constructor(props) {
      super(props);
      this.state = { data: {} }
  }

  componentDidMount() {
      const ref = firebase().ref("/식당/" + res);

      ref.once("value").then(snapshot => {
          if (snapshot)
              this.setState({ data: snapshot.val() });
          console.log(this.state.data)
      })
  }

  render() {
      return (
          <NativeBaseProvider>
              <Center flex={1}>
                  <Box
                      bg="primary.400"
                      p={4}
                      _text={{
                          fontSize: "xl",
                          fontWeight: "bold",
                          color: "white",
                      }}
                  >
                      {this.state.data["official_name"]}
                      {this.state.data["dong"]}
                      {this.state.data["category"]}
                      {this.state.data["address"]}
                      {this.state.data["menu"]}
                  </Box>
              </Center>
          </NativeBaseProvider>
      );
  }
}

const App = createStackNavigator(
  {
    Chat: {
      screen: Chat,
    },
    Home: {
      screen: Home,
    },
    Res: {
      screen: Res,
    },
    Settings
  },
  {
    initialRouteName: 'Home'
  },
);

const AppContainer = createAppContainer(App);

export default () => (
  <AppContainer />
);

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  eachView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})