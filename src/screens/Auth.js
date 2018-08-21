import React, {Component} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import startMainTabs from './startMainTabs';
import DefaultInput from '../components/UI/DefaultInput';
import HeadingText from '../components/UI/HeadingText';
import MainText from '../components/UI/MainText';
import ButtonWithBackground from '../components/UI/ButtonWithBackground';
import bgImg from '../assets/init_bg.jpg';
import validate from '../utility/validation';
import {tryAuth, authAutoSignIn} from "../store/actions/"
import SplashScreen from 'react-native-splash-screen'

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    Dimensions.addEventListener('change', this.updateStyles);
    this.state = {
      viewMode: Dimensions.get('window').height > 600 ? 'portrait' : 'landscape',
      authMode: 'login',
      controls: {
        email: {
          value: '',
          valid: false,
          validationRules: {
            isEmail: true
          },
          touched: false
        },
        pwd: {
          value: '',
          valid: false,
          validationRules: {
            minLength: 6
          },
          touched: false
        },
        confirmPwd: {
          value: '',
          valid: false,
          validationRules: {
            equalTo: 'pwd'
          },
          touched: false
        },

      }
    };
  }
  static options(passProps) {
    return {
      topBar: {
        title: {
          text: 'My Screen'
        },
        drawBehind: true,
        visible: false,
        animate: false
      }
    };
  }
  componentDidMount() {
    SplashScreen.hide();
    this.props.authAutoSignIn();
  }


  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyles)
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => ({
      authMode: prevState.authMode === 'login' ? 'signup' : 'login'
    }))
  };

  updateStyles = (dims) => {
    this.setState(prevState => ({
      viewMode: dims.window.height > 600 ? 'portrait' : 'landscape'
    }))
  };

  authHandler = () => {
    let {email, pwd} = this.state.controls;
    const authData = {
      email: email.value,
      password: pwd.value
    };
    this.props.onTryAuth(authData, this.state.authMode);
  };

  updateInputState = (key, value) => {
    let connectedValue;
    if (this.state.controls[key].validationRules.equalTo) {
      const equalControl = this.state.controls[key].validationRules.equalTo;
      const equalValue = this.state.controls[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      }
    }
    if (key === 'password') {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      }
    }
    this.setState(prevState => ({
      controls: {
        ...prevState.controls,
        confirmPwd: {
          ...prevState.controls.confirmPwd,
          valid: key === 'password'
            ? validate(
              prevState.controls.confirmPwd.value,
              prevState.controld.confirmPwd.validationRules,
              connectedValue)
            : prevState.controls.confirmPwd.valid
        },
        [key]: {
          ...prevState.controls[key],
          value: value,
          touched: true,
          valid: validate(value, prevState.controls[key].validationRules, connectedValue)
        },

      }
    }));
  };

  render() {
    let {viewMode} = this.state;
    let headingText = null;
    let confirmPasswordControl = null;
    let submitButton = (
      <ButtonWithBackground
        disabled={
          !this.state.controls.confirmPwd.valid && this.state.authMode !== 'login' ||
          !this.state.controls.pwd.valid ||
          !this.state.controls.email.valid}
        onPress={this.authHandler}
        color='#29aaf4'>Submit</ButtonWithBackground>
    );
    if (this.props.isLoading) {
      submitButton = <ActivityIndicator/>
    }
    if (viewMode === 'portrait') {
      headingText = (
        <MainText>
          <HeadingText>Please Log In</HeadingText>
        </MainText>
      );
    }
    if (this.state.authMode !== 'login') {
      confirmPasswordControl = (
        <View style={viewMode === 'portrait' ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
          <DefaultInput
            style={styles.input}
            placeholder="Confirm Password"
            value={this.state.controls.confirmPwd.value}
            onChangeText={(value) => this.updateInputState('confirmPwd', value)}
            valid={this.state.controls.confirmPwd.valid}
            touched={this.state.controls.confirmPwd.touched}
            secureTextEntry
          />
        </View>
      )
    }
    return (
      <ImageBackground source={bgImg} style={styles.backgroundImage}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {headingText}
          <ButtonWithBackground onPress={this.switchAuthModeHandler} color='#29aaf4'>
            Want to {this.state.authMode !== 'login' ? 'Login' : 'Signup'}?
          </ButtonWithBackground>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inputContainer}>
              <DefaultInput
                style={styles.input}
                placeholder="Type your E-mail Address"
                value={this.state.controls.email.value}
                onChangeText={(value) => this.updateInputState('email', value)}
                valid={this.state.controls.email.valid}
                touched={this.state.controls.email.touched}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
              />
              <View
                style={
                  viewMode === 'portrait' || this.state.authMode === 'login'
                    ? styles.portraitPasswordContainer
                    : styles.landscapePasswordContainer}>
                <View style={
                  viewMode === 'portrait' || this.state.authMode === 'login'
                    ? styles.portraitPasswordWrapper
                    : styles.landscapePasswordWrapper
                }>
                  <DefaultInput
                    style={styles.input}
                    placeholder="Password"
                    value={this.state.controls.pwd.value}
                    onChangeText={(value) => this.updateInputState('pwd', value)}
                    valid={this.state.controls.pwd.valid}
                    touched={this.state.controls.pwd.touched}
                    secureTextEntry
                  />
                </View>
                {confirmPasswordControl}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {submitButton}
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: '#eee',
    borderColor: '#bbb'
  },
  backgroundImage: {
    width: '100%',
    flex: 1
  },
  landscapePasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  landscapePasswordWrapper: {
    width: '45%'
  },
  portraitPasswordContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  portraitPasswordWrapper: {
    width: '100%'
  }
});

const mapStateToProps = (state) => {
  return {
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    onTryAuth: tryAuth,
    authAutoSignIn: authAutoSignIn
  }, dispatch)
};


export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);