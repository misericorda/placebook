import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import PlaceInput from '../components/PlaceInput';
import PickImage from '../components/PickImage';
import PickLocation from '../components/PickLocation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {addPlace, startAddPlace, placeAdded} from '../store/actions/index';
import {Navigation} from 'react-native-navigation';
import MainText from '../components/UI/MainText';
import HeadingText from '../components/UI/HeadingText';
import validate from '../utility/validation';

class SharePlaceScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.reset();
  }

  componentDidUpdate() {
    if (this.props.placeAdded) {
      Navigation.mergeOptions('memento.FindPlaceScreen', {bottomTabs: {currentTabIndex: 0}});
    }
  }

  componentDidDisappear() {
    this.props.startAddPlace()
  }

  onNavigationButtonPressed(buttonId) {
    if (buttonId === 'openLeftDrawer') {
      Navigation.mergeOptions('leftSideDrawer', {
        sideMenu: {
          left: {
            visible: true
          }
        }
      });
    }
  }

  addPlaceHandler = () => {
    let {placeName, location, image} = this.state.controls;
    this.props.addPlace(placeName.value, location.value, image.value);
    this.reset();
    this.imagePicker.reset();
    this.locationPicker.reset();
  };

  placeNameChangedHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          placeName: {
            ...prevState.controls.placeName,
            value: val,
            valid: validate(val, prevState.controls.placeName.validationRules),
            touched: true
          }
        }
      };
    });
  };

  locationPickedHandler = location => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          location: {
            value: location,
            valid: true
          }
        }
      };
    });
  };

  imagePickedHandler = image => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          image: {
            value: image,
            valid: true
          }
        }
      };
    });
  };

  reset = () => {
    this.setState({
      controls: {
        placeName: {
          value: "",
          valid: false,
          touched: false,
          validationRules: {
            notEmpty: true
          }
        },
        location: {
          value: null,
          valid: false
        },
        image: {
          value: null,
          valid: false
        }
      }
    });
  };

  render() {
    let submitButton = (
      <Button
        title="Share the Place!"
        onPress={this.addPlaceHandler}
        disabled={
          !this.state.controls.placeName.valid ||
          !this.state.controls.location.valid ||
          !this.state.controls.image.valid
        }
      />
    );
    if (this.props.isLoading) {
      submitButton = <ActivityIndicator/>;
    }
    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView>
          <View style={styles.container}>
            <MainText>
              <HeadingText>Share a Place!</HeadingText>
            </MainText>
            <PlaceInput
              placeData={this.state.controls.placeName}
              onChangeText={this.placeNameChangedHandler}
            />
            <PickImage onImagePicked={this.imagePickedHandler} ref={ref => this.imagePicker = ref}/>
            <PickLocation onLocationPick={this.locationPickedHandler} ref={ref => this.locationPicker = ref}/>
            <View style={styles.button}>
              {submitButton}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  placeholder: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#eee',
    width: '80%',
    height: 150,
  },
  button: {
    margin: 10
  },
  previewImage: {
    width: '100%',
    height: '100%',
  }
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addPlace,
    startAddPlace
  }, dispatch)
};

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  }
};

export default connect(mapStateToProps, mapDispatchToProps, null, {"withRef": true})(SharePlaceScreen);