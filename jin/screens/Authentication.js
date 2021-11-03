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
        source={require('../../images/custom_background.png')}
        resizeMode="cover"
      >
        <Image style={styles.img} source={require('../../images/appicon.png')} />
        <Text style={styles.title} bold>한슐랭 가이드</Text>
        <Text style={styles.subtitle}>한동인들을 위한 맛집 어플</Text>
        <View style={styles.centerMargin} />
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
    color: '#ffffff',
    fontSize: 35,
    marginBottom: 10,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 18,
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
  },
  centerMargin: {
    height: 250
  }
});