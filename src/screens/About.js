import React, {Component} from 'react';
import {View, Text, StyleSheet, ListView, FlatList} from 'react-native';
import {Navigation} from 'react-native-navigation';


const libsUsed = [
  'react', 'react-native',
  'react-native-image-picker', 'react-native-maps',
  'react-native-navigation', 'react-native-splash-screen',
  'react-native-vector-icons', 'redux', 'redux-saga'
];

class About extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  render() {
    return (
      <View style={styles.aboutContainer}>
        <Text style={styles.textHeader}>About</Text>
        <Text>This app is created by Dmitry Oleinik while learning ReactNative in July 2018.</Text>
        <Text style={{margin: 10}}>Technologies used:</Text>
        <View style={{width: '100%'}}>
          <FlatList data={libsUsed}
                    keyExtractor={(item, idx) => item}
                    renderItem={(item) => <Text style={{paddingLeft: 30}}>{`\u2022 ${item.item}`}</Text>}>
          </FlatList>
        </View>

      </View>
    );
  }
}

About.options = (passProps) => {
  return {
    bottomTab: {
      icon: passProps.bb,
    }
  }
};

const styles = StyleSheet.create({
  textHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 15
  },
  aboutContainer: {
    paddingBottom: 40,
    paddingTop: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});


export default About;