// 로그인 페이지

import React from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';
import Text from '../../defaultSetting/FontText';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function Authentication(props) {
  return (
    <View style={styles.screen}>
      <ImageBackground
        style={styles.background}
        source={require('../../images/temp_background.jpg')}
        resizeMode="cover"
      >
      <Text style={styles.title}>한슐랭 가이드</Text>
      <Image style={styles.img} source={require('../../images/appicon.png')} />
      <GoogleSigninButton onPress={props.onGoogleButtonPress} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});