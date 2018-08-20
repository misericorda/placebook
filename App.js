import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class App extends React.Component {

  componentDidMount() {
    // ImagePicker.showImagePicker({title: 'Pick an Image', maxWidth: 800, maxHeight: 600}, res => {
    //   if (res.didCancel) {
    //     console.log('User cancelled!');
    //   } else if (res.error) {
    //     console.log('Error', res.error);
    //   } else {
    //     console.log('Success!');
    //   }
    // })
  }

  render() {
    const myIcon = (<Icon name="rocket" size={30} color="#900" />)
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        {myIcon}
        <MapView style={{
          width: '100%',
          height: 200,
        }}
                 initialRegion={{
                   latitude: 37.78825,
                   longitude: -122.4324,
                   latitudeDelta: 0.0922,
                   longitudeDelta: 0.0421,
                 }}
        />
        <Text>HI</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
