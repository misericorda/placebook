import {call, put, takeEvery, takeLatest, all, select} from 'redux-saga/effects'
import {GET_PLACES} from "./../actions/actionTypes"
import {setPlaces} from "./../actions/places"
import {delay} from 'redux-saga'
import {BASE_FB_URL} from "../../constants"
import {getTokenAsync} from "./auth"
import {AsyncStorage} from 'react-native';
const getToken = state => state.auth.token;
import {startApp} from "../../../App"

const handleError = (err) => {
  console.log(err);
  alert('An unexpected error occurred, try switching the page');
  startApp()
  return null
};

function* getPlacesAsync() {
  let token = yield call(getTokenAsync);
  if (!token) return null;
  let res;
  try {
    res = yield fetch(`${BASE_FB_URL}/places.json?auth=${token}`);
    if (res.status !== 200) {
      return handleError('Network error');
    }
  } catch (e) {
    return handleError(e);
  }
  let data = yield res.json();
  const places = [];

  Object.keys(data).forEach(key => places.push({
    ...data[key],
    key,
    image: {
      uri: data[key].image
    }
  }));
  yield put(setPlaces(places))
}


function* watchGetPlaces() {
  yield takeEvery(GET_PLACES, getPlacesAsync)
}

export default function* places() {
  yield all([
    watchGetPlaces(),
  ])
}