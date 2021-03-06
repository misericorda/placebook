import React, {Component} from 'react';
import {
  View,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';

import PlaceInput from '../components/PlaceInput';
import PickImage from '../components/PickImage';
import PickLocation from '../components/PickLocation';
import MainText from '../components/UI/MainText';
import HeadingText from '../components/UI/HeadingText';
import validate from '../utility/validation';
import {startAddPlace} from '../store/actions';

class SharePlaceScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.reset();
  }

  componentDidUpdate() {
    if (this.props.placeAdded) {
      Navigation.mergeOptions('placebook.FindPlaceScreen', {bottomTabs: {currentTabIndex: 0}});
    }
  }

  addPlaceHandler = () => {
    let {placeName, location, image} = this.state.controls;
    let callback = () => {
      Navigation.mergeOptions('placebook.FindPlaceScreen', {bottomTabs: {currentTabIndex: 0}});
      this.reset();
      this.imagePicker.reset();
      this.locationPicker.reset();
    };
    this.props.startAddPlace(placeName.value, location.value, image.value, callback);
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
    );
  }
}

SharePlaceScreen.options = (passProps) => ({
  topBar: {
    visible: true,
    title: {
      text: 'Share Place'
    },
    leftButtons: [
      {
        id: 'openLeftDrawer',
        icon: passProps.lb,
        iconColor: 'orange',
        buttonColor: 'black',
        textColor: 'red',
      }
    ]
  },
  bottomTab: {
    icon: passProps.bb,
  }
});

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
    startAddPlace
  }, dispatch)
};

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);