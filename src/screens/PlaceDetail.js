import React, {Component} from 'react';
import {View, Image, Text, Platform, StyleSheet, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deletePlace} from "../store/actions/places"
import MapView from "react-native-maps";

class PlaceDetailScreen extends Component {
  onPlaceDelete = () => {
    let {selectedPlace, deletePlace, componentId} = this.props;
    deletePlace(selectedPlace.key);
    Navigation.pop(componentId);
  };

  render() {
    let {selectedPlace} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.placeDetailContainer}>
          <View style={styles.subContainer}>
            <Image
              source={selectedPlace.image}
              style={styles.placeImage}/>
            <Text style={styles.placeName}>{selectedPlace.name}</Text>
          </View>
          <View style={styles.subContainer}>
            <MapView
              initialRegion={{
                ...selectedPlace.location,
                latitudeDelta: 0.0122,
                longitudeDelta:
                Dimensions.get("window").width /
                Dimensions.get("window").height *
                0.0122
              }}
              style={styles.map}
            >
              <MapView.Marker coordinate={this.props.selectedPlace.location}/>
            </MapView>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View>
            <View style={styles.deleteButton}>
              <TouchableOpacity onPress={this.onPlaceDelete}>
                <Icon
                  size={30}
                  name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                  color="red"/>
              </TouchableOpacity>
            </View>
            {/*<Button title="Delete" color="red" onPress={props.onItemDeleted} style={styles.actionButton}/>*/}
            {/*<Button title="Close" onPress={props.onModalClosed} style={styles.actionButton}/>*/}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 22,
    flex: 1
  },
  portraitContainer: {
    flexDirection: "column"
  },
  landscapeContainer: {
    flexDirection: "row"
  },
  placeDetailContainer: {
    flex: 2
  },
  placeImage: {
    width: "100%",
    height: "100%"
  },
  placeName: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 28
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  deleteButton: {
    alignItems: "center"
  },
  subContainer: {
    flex: 1
  }
});


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    deletePlace
  }, dispatch)
};


export default connect(null, mapDispatchToProps, null, {"withRef": true})(PlaceDetailScreen);