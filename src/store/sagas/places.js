import axios from 'axios';
import {call, put, takeEvery, all} from 'redux-saga/effects'
import {GET_PLACES, START_DELETE_PLACE, START_ADD_PLACE} from "./../actions/actionTypes"
import {setPlaces, removePlace, uiStartLoading, uiStopLoading} from "./../actions"
import {DATABASE_URL, STORE_IMAGE_URL} from "../../constants"
import {getFirebaseCredentials} from "./auth"

const handleError = (err) => {
  console.log(err);
  alert('An unexpected error occurred, try switching the page!');
};

function* getPlacesAsync() {
  let credentials = yield call(getFirebaseCredentials);
  if (!credentials) return handleError('No token found');
  let {token, uid} = credentials;
  console.log(credentials);
  let res;
  console.log('Sending request');
  try {
    res = yield axios(`${DATABASE_URL}/${uid}/places.json?auth=${token}`);
  } catch (e) {
    console.log(e.response);
    return handleError(e);
  }
  // sends null if no places in db;
  let data = res.data || {};
  const places = [];
  console.log('Got places data', data);
  Object.keys(data).forEach(key => places.push({
    ...data[key],
    key,
    image: {
      uri: data[key].image
    }
  }));
  yield put(setPlaces(places));
}

function* addPlaceAsync({name, location, image, callback}) {
  console.log(name, location, image, callback);
  yield put(uiStartLoading());
  let credentials = yield call(getFirebaseCredentials);
  if (!credentials) return handleError('No token found');
  let {token, uid} = credentials;
  console.log('Got token, starting request. Token: ', token);
  try {
    // Save image into bucket
    let bucketResponse = yield axios({
      url: `${STORE_IMAGE_URL}`,
      method: 'POST',
      data: {image: image.base64},
      headers: {'authorization': 'Bearer ' + token}
    });
    let data = bucketResponse.data;
    // Save place with image url in firebase
    yield axios({
      url: `${DATABASE_URL}/${uid}/places.json?auth=${token}`,
      method: 'POST',
      data: {
        name,
        location,
        image: data.imageUrl,
        imagePath: data.imagePath
      }
    });
    yield put(uiStopLoading());
    callback();
  } catch (e) {
    yield call(handleError, e);
    yield put(uiStopLoading());
  }
}

export function* deletePlaceAsync({key, callback}) {
  console.log('Going to delete a place from firebase');
  let credentials = yield call(getFirebaseCredentials);
  if (!credentials) return handleError('No token found');
  let {token, uid} = credentials;
  yield put(removePlace(key));
  console.log('Removed place from store');
  let res;
  try {
    console.log('Sending request');
    yield axios.delete(`${DATABASE_URL}/${uid}/places/${key}.json?auth=${token}`);
  } catch (e) {
    console.log(res);
    return handleError(e)
  }
  console.log('Place was removed from firebase, removing from store...');
  yield put(removePlace(key));
  callback()
}


function* watchGetPlaces() {
  yield takeEvery(GET_PLACES, getPlacesAsync)
}

function* watchAddPlace() {
  yield takeEvery(START_ADD_PLACE, addPlaceAsync)
}

function* watchDeletePlace() {
  yield takeEvery(START_DELETE_PLACE, deletePlaceAsync)
}

export default function* placesSaga() {
  yield all([
    watchGetPlaces(),
    watchAddPlace(),
    watchDeletePlace()
  ])
}