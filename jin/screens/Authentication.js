// 로그인 페이지

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function Authentication(props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Hanchelin Guide</Text>
      <Image style={styles.img} source={require('../../images/logo.png')} />
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
    fontSize: 35,
    marginBottom: 30,
  },
  img: {
    marginTop: 20,
    marginBottom: 30,
    width: 200,
    height: 200,
  }
});