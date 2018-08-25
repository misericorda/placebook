import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MapView from 'react-native-maps';
import {Navigation} from 'react-native-navigation';

import Icon from 'react-native-vector-icons/Ionicons'
import {startDeletePlace} from '../store/actions/places'

const PlaceDetailScreen = (props) => {
  let {selectedPlace, componentId, deletePlace} = props;

  const onPlaceDelete = () => {
    deletePlace(selectedPlace.key, () => Navigation.pop(componentId));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.placeDetailContainer}>
          <Text style={styles.placeName}>{selectedPlace.name}</Text>
          <View style={styles.subContainer}>
            <Image source={selectedPlace.image} style={styles.placeImage}/>
          </View>
          <View style={styles.subContainer}>
            <MapView
              initialRegion={{
                ...selectedPlace.location,
                latitudeDelta: 0.0122,
                longitudeDelta:
                Dimensions.get('window').width /
                Dimensions.get('window').height *
                0.0122
              }}
              style={styles.map}
            >
              <MapView.Marker coordinate={props.selectedPlace.location}/>
            </MapView>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View>
            <View style={styles.deleteButton}>
              <TouchableOpacity onPress={onPlaceDelete}>
                <Icon size={30} name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'} color='red'/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    flex: 1
  },
  portraitContainer: {
    flexDirection: 'column'
  },
  landscapeContainer: {
    flexDirection: 'row'
  },
  placeDetailContainer: {
    flex: 1
  },
  placeImage: {
    width: '100%',
    height: 250,
    marginBottom: 30
  },
  placeName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 15
  },
  map: {
    width: '100%',
    height: 200,
  },
  deleteButton: {
    alignItems: 'center'
  },
  subContainer: {
    flex: 1,
    marginBottom: 10
  }
});


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    deletePlace: startDeletePlace
  }, dispatch)
};


export default connect(null, mapDispatchToProps)(PlaceDetailScreen);