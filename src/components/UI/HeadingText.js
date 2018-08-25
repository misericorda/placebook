import React from 'react'
import {Text, StyleSheet} from 'react-native';

const HeadingText = props => (
  <Text {...props} style={[styles.textHeading, props.style]}>
    {props.children}
  </Text>
);

const styles = StyleSheet.create({
  textHeading: {
    fontSize: 29,
    fontWeight: '500',
    marginBottom: 20
  },
});

export default HeadingText;