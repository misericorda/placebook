import {AsyncStorage} from 'react-native';

import startApp from '../../../App';
import {TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN} from "./actionTypes"
import {uiStartLoading, uiStopLoading} from './index';
import startMainTabs from '../../screens/startMainTabs';


const API_KEY = 'AIzaSyC1CZ1S4grsDPMYrBjumJ-QZxjl2sRdmgE';


export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading());
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + API_KEY;
    if (authMode === 'signup') {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + API_KEY;
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .catch(err => {
        dispatch(uiStopLoading());
        console.log(err);
        alert('Authentication failed, please try again!');
      })
      .then(res => res.json())
      .then(parsed => {
        dispatch(uiStopLoading());
        if (!parsed.idToken) {
          alert('Authentication failed, please try again!');
        } else {
          startMainTabs();
          dispatch(authStoreToken(parsed.idToken, parsed.expiresIn, parsed.refreshToken))
        }
      })
  }
};


export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + 10 * expiresIn;
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem('placebook:auth:token', token);
    AsyncStorage.setItem('placebook:auth:expiryDate', expiryDate.toString());
    AsyncStorage.setItem('placebook:auth:refreshToken', refreshToken);
  }
};


export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token,
    expiryDate
  }
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    let promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;
      console.log('Got token', token);
      if (!token || new Date(expiryDate) <= new Date()) {
        let fetchedToken;
        AsyncStorage.getItem('placebook:auth:token')
          .catch(err => reject())
          .then(token => {
            fetchedToken = token;
            if (!token) {
              reject('No token found');
              return;
            }
            // check expiry date
            return AsyncStorage.getItem('placebook:auth:expiryDate');

          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(fetchedToken));
              resolve(fetchedToken);
            } else {
              reject('Token expired')
            }
          })
          .catch(err => reject(err));
      } else {
        resolve(token)
      }
    });
    return promise
      .catch(err => {
        return AsyncStorage.getItem('placebook:auth:refreshToken')
          .then(refreshToken => {
            console.log('Found refresh token', refreshToken);
            return fetch('https://securetoken.googleapis.com/v1/token?key=' + API_KEY, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded '
              },
              body: "grant_type=refresh_token&refresh_token=" + refreshToken
            })
          })
          .then(res => {
            if (res.ok) {
              return res.json()
            } else {
              throw (new Error())
            }
          })
          .then(parsed => {
            if (parsed.id_token) {
              dispatch(authStoreToken(parsed.id_token, parsed.expires_in, parsed.refresh_token));
              console.log('Token refreshed');
              return parsed.id_token;
            } else {
              dispatch(authClearStorage());
            }
          })
      })
      .then(token => {
        if (!token) {
          throw new Error('No token found');
        } else {
          return token
        }
      })
  }
};


export const authAutoSignIn = () => {
  return dispatch => {
    console.log('Trying auto-sign-in')
    dispatch(authGetToken())
      .then(token => {
        console.log('Got token, starting main tabs');
        startMainTabs()
      })
      .catch(err => console.log('Failed to fetch token!', err))
  }
};

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem('placebook:auth:token');
    AsyncStorage.removeItem('placebook:auth:expiryDate');
    return AsyncStorage.removeItem('placebook:auth:refreshToken');
  }
};


export const authLogout = () => {
  console.log('Logout pressed');
  return dispatch => {
    dispatch(authClearStorage())
      .then(() => {
        console.log('Prepare to start app');
        startApp()
      });
    dispatch(authRemoveToken())
  }
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  }
};