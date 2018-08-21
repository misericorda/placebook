import React from 'react';
import {Navigation} from "react-native-navigation";
import {Provider} from "react-redux";
import configureStore from './src/store/configureStore';

import About from "./src/screens/About";
import AuthScreen from "./src/screens/Auth";
import FindPlace from "./src/screens/FindPlace";
import SharePlace from "./src/screens/SharePlace";
import PlaceDetail from "./src/screens/PlaceDetail";
import SideDrawer from "./src/screens/SideDrawer";
import Icon from 'react-native-vector-icons/Ionicons'
// import ReduxHOC from './src/components/ReduxHOC';

const store = configureStore();


// Register Screens
Navigation.registerComponentWithRedux("placebook.AuthScreen", () => AuthScreen, Provider, store);
Navigation.registerComponentWithRedux("placebook.FindPlace", () => FindPlace, Provider, store);
Navigation.registerComponentWithRedux("placebook.SharePlace", () => SharePlace, Provider, store);
Navigation.registerComponentWithRedux("placebook.PlaceDetail", () => PlaceDetail, Provider, store);
// Navigation.registerComponent("placebook.SideDrawer", () => SideDrawer);
Navigation.registerComponentWithRedux("placebook.SideDrawer", () => SideDrawer, Provider, store);
Navigation.registerComponent("placebook.Icon", () => Icon);
Navigation.registerComponent("placebook.About", () => About);
// Trigger sidemenu open
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
// Start the App
const startApp = () => Navigation.setRoot({
  root: {
    component: {
      name: 'placebook.AuthScreen',
    }
  }
});

startApp();

export default startApp;

