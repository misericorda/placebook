import {AppRegistry} from 'react-native';
import {Navigation} from "react-native-navigation";
import {name as appName} from './app.json';
import App from './App';

Navigation.registerComponent(`navigation.playground.WelcomeScreen`, () => App);
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: "navigation.playground.WelcomeScreen"
      }
    }
  });
});
// AppRegistry.registerComponent('placebook', () => App);
