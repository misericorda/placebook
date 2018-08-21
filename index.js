import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';

import App from './App';



const ReduxApp = () => (
  <Provider store={store}>
    <App/>
  </Provider>
);

AppRegistry.registerComponent('placebook', () => ReduxApp);
