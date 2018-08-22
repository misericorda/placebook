import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';


import createSagaMiddleware from 'redux-saga'
import placesReducer from './reducers/places'
import uiReducer from './reducers/ui'
import authReducer from './reducers/auth'

import rootSaga from './sagas/index'

const rootReducer = combineReducers({
  places: placesReducer,
  ui: uiReducer,
  auth: authReducer
});


const sagaMiddleware = createSagaMiddleware();

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

const configureStore = () => {
  let store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, sagaMiddleware)));
  sagaMiddleware.run(rootSaga);
  return store;
};



export default configureStore;