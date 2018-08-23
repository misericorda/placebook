import {
  REMOVE_PLACE,
  SET_PLACES,
  START_ADD_PLACE,
  GET_PLACES,
  START_DELETE_PLACE
} from "./actionTypes";

export const startAddPlace = (name, location, image, callback = f => f) => {
  return {
    type: START_ADD_PLACE,
    name,
    location,
    image,
    callback
  }
};

export const startDeletePlace = (key, callback = f => f) => ({
  type: START_DELETE_PLACE,
  key,
  callback
});

export const removePlace = key => ({
  type: REMOVE_PLACE,
  key: key
});

export const getPlaces = () => ({
  type: GET_PLACES,
});

export const setPlaces = places => ({
  type: SET_PLACES,
  places
});


