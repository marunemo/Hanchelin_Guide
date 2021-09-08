import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default class CustomText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Text style={[
        this.props.style,
        (this.props.style?.fontWeight == 'bold') ? styles.boldFontText : styles.fontText
      ]}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  fontText: {
    fontFamily: 'ELANDchoiceM'
  },
  boldFontText: {
    fontFamily: 'ELANDchoiceB'
  }
});