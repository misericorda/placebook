import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addPlace, getPlaces} from '../store/actions/index';
import PlaceList from '../components/PlaceList';
import {Navigation} from 'react-native-navigation';
import ButtonWithBackground from "../components/UI/ButtonWithBackground";

class About extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  static options(passProps) {
    return {
      topBar: {
        visible: true,
        title: {
          text: 'About'
        },
        leftButtons: [
          {
            id: 'openLeftDrawer',
            icon: passProps.lb,
            iconColor: 'orange'
          }
        ]
      },
      bottomTab: {
        // text: 'Find',
        icon: passProps.bb,
      }
    }
  }

  render() {
    return (
      <View style={styles.aboutContainer}>
        <Text>Hi, this is about page</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  aboutContainer: {
    paddingBottom: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});


export default About;