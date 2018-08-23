import {
  AUTH_TRY_AUTH,
  AUTH_SET_CREDENTIALS,
  AUTH_TRY_AUTO_SIGN_IN,
  AUTH_START_LOG_OUT} from "./actionTypes"

export const authLogout = () => {
  return {
    type: AUTH_START_LOG_OUT
  }
};
export const tryAutoSignIn = () => {
  return {
    type: AUTH_TRY_AUTO_SIGN_IN
  }
};
export const authSetCredentials = (token, expiryDate, uid) => {
  return {
    type: AUTH_SET_CREDENTIALS,
    token,
    expiryDate,
    uid
  }
};
export const tryAuth = (authData, authMode) => {
  return {
    type: AUTH_TRY_AUTH,
    authData,
    authMode
  }
};