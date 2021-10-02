import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fontSize } from 'styled-system';

export default class CustomText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Text style={[
        this.props.style,
        this.props.bold ? styles.boldFontText : styles.fontText
      ]}>
        {this.props.bold ? this.props.children : this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  fontText: {
  },
  boldFontText: {
    fontFamily: 'ELANDChoiceB'
  }
});