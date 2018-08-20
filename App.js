import React from 'react';
import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";
import configureStore from './src/store/configureStore';

import AuthScreen from "./src/screens/Auth";
import FindPlace from "./src/screens/FindPlace";
import SharePlace from "./src/screens/SharePlace";
import PlaceDetail from "./src/screens/PlaceDetail";
import SideDrawer from "./src/screens/SideDrawer";
import Icon from 'react-native-vector-icons/Ionicons'
// import ReduxHOC from './src/components/ReduxHOC';

const store = configureStore();


// Register Screens
Navigation.registerComponentWithRedux("memento.AuthScreen", () => AuthScreen, Provider, store);
Navigation.registerComponentWithRedux("memento.FindPlace", () => FindPlace, Provider, store);
Navigation.registerComponentWithRedux("memento.SharePlace", () => SharePlace, Provider, store);
Navigation.registerComponentWithRedux("memento.PlaceDetail", () => PlaceDetail, Provider, store);
// Navigation.registerComponent("memento.SideDrawer", () => SideDrawer);
Navigation.registerComponentWithRedux("memento.SideDrawer", () => SideDrawer, Provider, store);
Navigation.registerComponent("memento.Icon", () => Icon);

// Start a App
const startApp = () => Navigation.setRoot({
  root: {
    stack: {
      children: [{
        component: {
          name: 'memento.AuthScreen',
          passProps: {
            text: 'stack with one child'
          }
        }
      }],
      options: {
        topBar: {
          title: {
            text: 'Welcome screen'
          }
        }
      }
    }
  }
});

startApp();

export default startApp;

