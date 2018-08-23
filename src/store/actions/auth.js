import {
  AUTH_TRY_AUTH,
  AUTH_SET_TOKEN,
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
export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token,
    expiryDate
  }
};
export const tryAuth = (authData, authMode) => {
  return {
    type: AUTH_TRY_AUTH,
    authData,
    authMode
  }
};