import axios from 'axios';
import {AsyncStorage} from 'react-native';
// import firebase, {firebaseRef} from "../../firebase"

import {call, put, takeEvery, all, select} from 'redux-saga/effects'
import {
  AUTH_TRY_AUTO_SIGN_IN,
  AUTH_START_LOG_OUT,
  AUTH_REMOVE_TOKEN,
  AUTH_TRY_AUTH
} from '../actions/actionTypes';
import {authSetCredentials, uiStartLoading, uiStopLoading} from '../actions'
import {
  STORAGE_TOKEN_NAME,
  STORAGE_TOKEN_EXP_DATE_NAME,
  STORAGE_TOKEN_REFRESH_NAME,
  STORAGE_USER_ID,
  FIREBASE_API_KEY
} from '../../constants';
import {startMainTabs, startLoginScreen} from '../../screens'

const getAuthObject = state => state.auth;

const getAuthUrl = (mode) => {
  return mode === 'signup'
    ? 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + FIREBASE_API_KEY
    : 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + FIREBASE_API_KEY;
};

export function* getFirebaseCredentials() {
  // Try to get token from store or Async storage first
  // If token expired - try to use refresh token to get a new one
  let credentials = yield call(getFirebaseCredentialsFromReduxOrStorage);
  if (!credentials) {
    credentials = yield call(tryTokenRefresh);
  }
  if (!credentials) yield call(clearTokenStorage);
  return credentials
}

function* getFirebaseCredentialsFromReduxOrStorage() {
  let authObject = yield select(getAuthObject);
  let {uid, token, expiryDate} = authObject;
  expiryDate = new Date(parseInt(expiryDate));
  console.log(`Got credentials from store\nUid: ${uid}\nToken: ${token}\nExpDate: ${expiryDate}`);
  try {
    if (!uid || !token || expiryDate <= new Date()) {
      console.log('No valid token found in store');
      let credentialsFromStorage = yield call([AsyncStorage, 'multiGet'],
        [STORAGE_TOKEN_NAME, STORAGE_TOKEN_EXP_DATE_NAME, STORAGE_USER_ID]);
      let uid = credentialsFromStorage[3][1];
      let storedToken = credentialsFromStorage[0][1];
      let expDate = credentialsFromStorage[1][1];
      let storedUid = credentialsFromStorage[2][1];
      if (!uid || !storedToken) {
        console.log('No credentials found in AsyncStorage');
        return null;
      }
      const parsedExpiryDate = new Date(parseInt(expDate));
      const now = new Date();
      if (parsedExpiryDate > now) {
        console.log('Found valid token in storage');
        yield put(authSetCredentials(storedToken, expDate, uid));
        console.log('Credentials refreshed from storage');
        return {token: storedToken, storedUid};
      } else {
        console.log('Token in storage expired');
        return null;
      }
    } else {
      console.log('Token with valid expDate was found in store');
      return {token, uid}
    }
  } catch (e) {
    return null;
  }
}

function* tryTokenRefresh() {
  let refreshToken = yield AsyncStorage.getItem(STORAGE_TOKEN_REFRESH_NAME);
  try {
    if (!refreshToken) return null;
    let url = 'https://securetoken.googleapis.com/v1/token?key=' + FIREBASE_API_KEY;
    let body = 'grant_type=refresh_token&refresh_token=' + refreshToken;
    let response;
    try {
      response = yield axios.post(url, body, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
    } catch (e) {
      console.log('Network error', e);
      return null
    }
    console.log(response);
    let {id_token, expires_in, refresh_token, user_id} = response.data;
    if (!id_token) return null;
    yield call(storeCredentials, id_token, expires_in, refresh_token, user_id);
    console.log('Token refreshed');
    return {token: id_token, uid: user_id};
  } catch (e) {
    return null
  }
}

function* storeCredentials(token, expiresIn, refreshToken, uid) {
  const now = new Date();
  const expiryDate = now.getTime() + 1000 * expiresIn;
  yield put(authSetCredentials(token, expiryDate, uid));
  let valuesToSet = [
    [STORAGE_TOKEN_NAME, token],
    [STORAGE_TOKEN_EXP_DATE_NAME, expiryDate.toString()],
    [STORAGE_TOKEN_REFRESH_NAME, refreshToken],
    [STORAGE_USER_ID, uid],
  ];
  yield call([AsyncStorage, 'multiSet'], valuesToSet);
  return null
}

function* clearTokenStorage() {
  yield call([AsyncStorage, 'removeItem'], STORAGE_TOKEN_NAME);
  yield call([AsyncStorage, 'removeItem'], STORAGE_TOKEN_EXP_DATE_NAME);
  yield call([AsyncStorage, 'removeItem'], STORAGE_TOKEN_REFRESH_NAME);
  yield call([AsyncStorage, 'removeItem'], STORAGE_USER_ID);
}

function* tryAutoSignIn() {
  console.log('Trying auto-sign-in');
  let token = yield call(getFirebaseCredentials);
  if (token) {
    console.log('Auto sign-in worked');
    startMainTabs()
  } else {
    console.log('Auto sign-in failed, returning to login screen')
  }
}

function* authUser({authData, authMode}) {
  yield put(uiStartLoading());
  let url = getAuthUrl(authMode);
  console.log(url);
  let response;
  let data = {
    email: authData.email,
    password: authData.password,
    returnSecureToken: true,
  };
  try {
    response = yield axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    console.log(e);
    yield put(uiStopLoading());
    return alert('Authentication failed, please try again!');
  }
  console.log(response.data);
  let {idToken, expiresIn, refreshToken, localId} = response.data;
  yield put(uiStopLoading());
  if (!idToken) return alert('Authentication failed, please try again!');
  console.log('Got data, saving it...');
  yield call(storeCredentials, idToken, expiresIn, refreshToken, localId);
  console.log('token set, auth succeeded');
  return startMainTabs();
}

function* logOut() {
  console.log('Initiating logout saga');
  yield call(clearTokenStorage);
  console.log('AsyncStorage cleared');
  yield put({type: AUTH_REMOVE_TOKEN});
  console.log('Tokens removed from store');
  startLoginScreen()
}

function* watchAutoSignIn() {
  yield takeEvery(AUTH_TRY_AUTO_SIGN_IN, tryAutoSignIn)
}

function* watchLogOut() {
  yield takeEvery(AUTH_START_LOG_OUT, logOut)
}

function* watchTryAuth() {
  yield takeEvery(AUTH_TRY_AUTH, authUser)
}

export default function* auth() {
  yield all([
    watchAutoSignIn(),
    watchLogOut(),
    watchTryAuth(),
  ])
}