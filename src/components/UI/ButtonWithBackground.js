import React from 'react'
import {TouchableOpacity, TouchableNativeFeedback, Text, View, StyleSheet, Platform} from 'react-native';

const ButtonWithBackground = props => {
  const content = (
    <View style={[styles.button, props.disabled ? styles.disabled : null]}>
      <Text style={[styles.text, props.disabled ? styles.disabledText : null]}>
        {props.children}
      </Text>
    </View>
  );
  if (props.disabled) {
    return content
  }
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    )
  } else {
    return (
      <TouchableOpacity onPress={props.onPress} underlayColor='red'>
        {content}
      </TouchableOpacity>
    )
  }
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 0,
    borderColor: 'black',
    backgroundColor: '#3087e0',
  },
  disabled: {
    backgroundColor: '#eee',
    borderColor: '#aaa'
  },
  text: {
    fontWeight: 'bold',
    color: '#fff',
  },
  disabledText: {
    color: '#aaa',
  }
});

export default ButtonWithBackground;