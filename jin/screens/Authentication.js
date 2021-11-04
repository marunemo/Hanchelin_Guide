// 로그인 페이지

import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ImageBackground } from 'react-native';
import Text from '../../defaultSetting/FontText';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

export default function Authentication(props) {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(withTiming(10), 6, true)
  }, [])

  return (
    <View style={styles.screen}>
      <ImageBackground
        style={styles.background}
        source={require('../../images/custom_background.png')}
        resizeMode="cover"
      >
        <Animated.View style={animatedStyle}>
        <Image style={styles.img} source={require('../../images/appicon.png')} />
        </Animated.View>
        <Text style={styles.title} bold>한슐랭 가이드</Text>
        <Text style={styles.subtitle}>한동인들을 위한 맛집 어플</Text>
        <View style={styles.centerMargin} />
        <GoogleSigninButton
          style={{ width: 230, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          onPress={props.onGoogleButtonPress}
          disabled={props.disabled}
        />
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
    height: 100
  }
});