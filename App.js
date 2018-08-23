import React from 'react';
import {Navigation} from "react-native-navigation";
import Icon from 'react-native-vector-icons/Ionicons'
import {Provider} from "react-redux";

import About from "./src/screens/About";
import AuthScreen from "./src/screens/Auth";
import FindPlace from "./src/screens/FindPlace";
import SharePlace from "./src/screens/SharePlace";
import PlaceDetail from "./src/screens/PlaceDetail";
import SideDrawer from "./src/screens/SideDrawer";

import {startLoginScreen} from "./src/screens/index"

import configureStore from './src/store/configureStore';

const store = configureStore();

// Register Screens
Navigation.registerComponentWithRedux("placebook.AuthScreen", () => AuthScreen, Provider, store);
Navigation.registerComponentWithRedux("placebook.FindPlace", () => FindPlace, Provider, store);
Navigation.registerComponentWithRedux("placebook.SharePlace", () => SharePlace, Provider, store);
Navigation.registerComponentWithRedux("placebook.PlaceDetail", () => PlaceDetail, Provider, store);
Navigation.registerComponentWithRedux("placebook.SideDrawer", () => SideDrawer, Provider, store);
Navigation.registerComponent("placebook.Icon", () => Icon);
Navigation.registerComponent("placebook.About", () => About);
// Trigger side menu open
Navigation.events().registerNavigationButtonPressedListener(({buttonId}) => {
  if (buttonId === 'openLeftDrawer') {
    Navigation.mergeOptions('leftSideDrawer', {
      sideMenu: {
        left: {
          visible: true
        }
      }
    });
  }
});

startLoginScreen();

