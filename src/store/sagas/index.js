import {all} from 'redux-saga/effects'

import placesSaga from './places'
import authSaga from './auth'

export default function* rootSaga() {
  yield all([
    placesSaga(),
    authSaga()
  ])
}