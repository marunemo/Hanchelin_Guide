// 로그인 페이지

import React from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';
import { Center, NativeBaseProvider } from "native-base";
import Text from '../../defaultSetting/FontText';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function Authentication(props) {
  return (
    <NativeBaseProvider>
      <View style={styles.screen}>
        <ImageBackground
          style={styles.background}
          source={require('../../images/bg.jpg')}
          resizeMode="cover"
        >
          <Image style={styles.img} source={require('../../images/appicon.png')} />
          <Center style={styles.titleBox}>
            <Text style={styles.title} bold>한슐랭 가이드</Text>
            <Text style={styles.subtitle}>한동인들을 위한 맛집 어플</Text>
          </Center>
          <View style={styles.centerMargin} />
          <GoogleSigninButton
            style={{ width: 230, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            onPress={props.onGoogleButtonPress}
            disabled={props.disabled}
          />
        </ImageBackground>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  titleBox: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingVertical: 14,
  },
  title: {
    color: '#ffffff',
    fontSize: 44,
    marginBottom: 12,
    fontFamily: 'ELANDChoiceB',
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 21,
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
    height: "35%"
  }
});