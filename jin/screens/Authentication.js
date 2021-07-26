// 앱에 들어가면 가장 먼저 나오는 로그인 화면이다.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function Authentication(props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Google Authentication</Text>
      <GoogleSigninButton onPress={props.onGoogleButtonPress} />
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
});