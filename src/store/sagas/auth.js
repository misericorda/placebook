import {call, put, takeEvery, takeLatest, all, select} from 'redux-saga/effects'
import {authSetToken} from "../actions/auth"
import {AsyncStorage} from 'react-native';
import {startApp} from '../../../App';
import {TRY_AUTO_SIGN_IN, LOG_OUT, AUTH_REMOVE_TOKEN, TRY_AUTH} from "../actions/actionTypes";
import startMainTabs from '../../screens/startMainTabs';
import {uiStartLoading, uiStopLoading} from "../actions/ui"

const getTokenKey = state => state.auth.token;
const getExpDateKey = state => state.auth.expiryDate;

const STORAGE_TOKEN_NAME = 'placebook:auth:token';
const STORAGE_TOKEN_EXP_DATE_NAME = 'placebook:auth:expiryDate';
const STORAGE_TOKEN_REFRESH_NAME = 'placebook:auth:refreshToken';

const API_KEY = 'AIzaSyC1CZ1S4grsDPMYrBjumJ-QZxjl2sRdmgE';

export function* getTokenAsync() {
  let token = yield call(getTokenFromStoreOrStash);
  if (!token) token = yield call(tryTokenRefresh);
  if (!token) yield call(clearTokenStorage);
  return token
}

function* getTokenFromStoreOrStash() {
  let token = yield select(getTokenKey);
  let expDate = yield select(getExpDateKey);
  if (!token || new Date(expDate) <= new Date()) {
    console.log('No valid token found in store');
    let storedToken = yield call([AsyncStorage, 'getItem'], STORAGE_TOKEN_NAME);
    if (!storedToken) {
      console.log('No token found in storage');
      return null;
    }
    let expDate = yield call([AsyncStorage, 'getItem'], STORAGE_TOKEN_EXP_DATE_NAME);
    const parsedExpiryDate = new Date(parseInt(expDate));
    const now = new Date();
    if (parsedExpiryDate > now) {
      console.log('Found valid token in storage');
      yield put(authSetToken(storedToken, expDate));
      console.log('Token in store refreshed from storage');
      return storedToken;
    } else {
      console.log('Token in storage expired');
      return null;
    }
  } else {
    // yield put(authSetToken(token, expDate));
    console.log('Token with valid expDate was found in store');
    return token
  }
}

function* tryTokenRefresh() {
  let refreshToken = yield AsyncStorage.getItem(STORAGE_TOKEN_REFRESH_NAME);
  if (!refreshToken) return null;
  let options = {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: "grant_type=refresh_token&refresh_token=" + refreshToken
  };
  let response;
  try {
    response = yield fetch('https://securetoken.googleapis.com/v1/token?key=' + API_KEY, options);
  } catch (e) {
    console.log('Network error', e);
    return null
  }
  if (!response.ok) return null;
  let data = yield response.json();
  let {id_token, expires_in, refresh_token} = data;
  if (!id_token) return null;
  yield call(storeToken, id_token, expires_in, refresh_token);
  console.log('Token refreshed');
  return id_token;
}

function* storeToken(token, expiresIn, refreshToken) {
  const now = new Date();
  const expiryDate = now.getTime() + 10 * expiresIn;
  yield put(authSetToken(token, expiryDate));
  call([AsyncStorage, 'setItem'], STORAGE_TOKEN_NAME, token);
  call([AsyncStorage, 'setItem'], STORAGE_TOKEN_EXP_DATE_NAME, expiryDate.toString());
  call([AsyncStorage, 'setItem'], STORAGE_TOKEN_REFRESH_NAME, refreshToken);
  return null
}

function* clearTokenStorage() {
  yield call([AsyncStorage, 'removeItem'], STORAGE_TOKEN_NAME);
  yield call([AsyncStorage, 'removeItem'], STORAGE_TOKEN_EXP_DATE_NAME);
  yield call([AsyncStorage, 'removeItem'], STORAGE_TOKEN_REFRESH_NAME);
}

function* tryAutoSignIn() {
  console.log('Trying auto-sign-in');
  let token = yield call(getTokenAsync);
  if (token) {
    console.log('Auto sign-in worked');
    startMainTabs()
  } else {
    console.log('Auto sign-in failed, returning to login screen')
  }
}

const getAuthUrl = (mode) => {
  return mode === 'signup'
    ? 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + API_KEY
    : 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + API_KEY;
};

function* authUser({authData, authMode}) {
  yield put(uiStartLoading());
  let url = getAuthUrl(authMode);
  console.log(url);
  let response;
  try {
    let requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    response = yield fetch(url, requestOptions);
    if (response.status !== 200) {
      throw new Error('Failed')
    }
  } catch (e) {
    yield put(uiStopLoading());
    console.log(e);
    alert('Authentication failed, please try again!');
  }
  let data = yield response.json();
  let {idToken, expiresIn, refreshToken} = data;
  yield put(uiStopLoading());
  console.log('Got data, saving it...')
  if (!idToken) {
    alert('Authentication failed, please try again!');
  }
  yield call(storeToken, idToken, expiresIn, refreshToken);
  console.log('token set, auth succeeded');
  return startMainTabs();
}

function* logOut() {
  console.log('Initiating logout saga');
  yield call(clearTokenStorage);
  console.log('AsyncStorage cleared');
  yield put({type: AUTH_REMOVE_TOKEN});
  console.log('Tokens removed from store');
  startApp()
}

function* watchAutoSignIn() {
  yield takeEvery(TRY_AUTO_SIGN_IN, tryAutoSignIn)
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT, logOut)
}

function* watchTryAuth() {
  yield takeEvery(TRY_AUTH, authUser)
}

export default function* auth() {
  yield all([
    watchAutoSignIn(),
    watchLogOut(),
    watchTryAuth(),
  ])
}