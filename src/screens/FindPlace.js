import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Navigation} from 'react-native-navigation';

import {getPlaces} from '../store/actions/index';
import PlaceList from '../components/PlaceList';

class FindPlaceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placesLoaded: false,
      removeAnim: new Animated.Value(1)
    };
    Navigation.events().bindComponent(this);
  }

  componentDidAppear() {
    this.props.getPlaces()
  }

  itemSelectedHandler = key => {
    const selPlace = this.props.places.find(place => place.key === key);
    Navigation.push(this.props.componentId,
      {
        component: {
          name: 'placebook.PlaceDetail',
          passProps: {
            selectedPlace: selPlace
          },
          options: {
            topBar: {
              title: {
                text: selPlace.name
              }
            }
          }
        }
      },
    );
  };

  placesSearchHandler = () => {
    Animated.timing(this.state.removeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      this.setState({
        placesLoaded: true
      });
    });

  };

  render() {
    let content = (
      <Animated.View
        style={{
          opacity: this.state.removeAnim,
          transform: [
            {
              scale: this.state.removeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 1]
              })
            }
          ]
        }}>
        <TouchableOpacity onPress={this.placesSearchHandler}>
          <View style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Find Places</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
    if (this.state.placesLoaded) {
      content = (
        <PlaceList places={this.props.places} onItemSelected={this.itemSelectedHandler}/>
      )
    }
    return (
      <View style={this.state.placesLoaded
        ? styles.placesContainer
        : styles.buttonContainer}>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placesContainer: {
    paddingBottom: 40
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchButton: {
    borderColor: 'orange',
    borderWidth: 3,
    borderRadius: 30,
    padding: 15
  },
  searchButtonText: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 26
  }
});

FindPlaceScreen.options = (passProps) => {
  return {
    topBar: {
      visible: true,
      title: {
        text: 'Find Place'
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
      icon: passProps.bb,
    }
  }
};

const mapStateToProps = (state) => {
  return {
    places: state.places.places
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getPlaces,
  }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);