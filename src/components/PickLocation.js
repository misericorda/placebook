import React, {Component} from 'react';

import {View, Button, StyleSheet, Dimensions} from 'react-native';
import MapView from 'react-native-maps';


class PickLocation extends Component {
  componentWillMount() {
    this.reset()
  }

  reset = () => {
    this.setState({
      focusedLocation: {
        latitude: 37.7900352,
        longitude: -122.4013726,
        latitudeDelta: 0.0122,
        longitudeDelta:
        Dimensions.get('window').width /
        Dimensions.get('window').height *
        0.0122,
      },
      locationChosen: false,
    })
  };

  pickLocationHandler = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;

    this.map.animateToRegion({
      ...this.state.focusedLocation,
      latitude,
      longitude
    });
    this.setState(prevState => ({
      focusedLocation: {
        ...prevState.focusedLocation,
        latitude,
        longitude
      },
      locationChosen: true,
    }));
    this.props.onLocationPick({
      latitude,
      longitude
    })
  };

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coordsEvent = {
          nativeEvent: {
            coordinate: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }
          }
        };
        this.pickLocationHandler(coordsEvent)
      },
      err => {
        alert('Fetching the Position failed, please chose one manually!')
      }
    );
  };

  render() {
    let marker = null;
    if (this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.focusedLocation}/>
    }
    return (
      <View style={styles.container}>
        <MapView
          initialRegion={this.state.focusedLocation}
          region={!this.state.locationChosen ? this.state.focusedLocation : null}
          style={styles.map}
          onPress={this.pickLocationHandler}
          ref={ref => this.map = ref}
        >
          {marker}
        </MapView>
        <View style={styles.button}>
          <Button title="Locate Me" onPress={this.getLocationHandler}/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: 200,
  },
  button: {
    margin: 10
  },
});

export default PickLocation;