import {AUTH_SET_CREDENTIALS, AUTH_REMOVE_TOKEN, DISABLE_AUTO_SIGN_IN} from "../actions/actionTypes"

const initialState = {
  token: null,
  expiryDate: null,
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_CREDENTIALS:
      return {
        ...state,
        token: action.token,
        expiryDate: action.expiryDate,
        uid: action.uid
      };
    case AUTH_REMOVE_TOKEN:
      return {
        ...state,
        token: null,
        expiryDate: null
      };
    default:
      return state
  }
};

export default reducer;