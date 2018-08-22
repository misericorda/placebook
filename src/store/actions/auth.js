import {TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN, TRY_AUTO_SIGN_IN, LOG_OUT} from "./actionTypes"

export const authLogout = () => {
  return {
    type: LOG_OUT
  }
};

export const tryAutoSignIn = () => {
  return {
    type: TRY_AUTO_SIGN_IN
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
    type: TRY_AUTH,
    authData,
    authMode
  }
};