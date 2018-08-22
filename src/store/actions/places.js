import {REMOVE_PLACE, SET_PLACES, PLACE_ADDED, START_ADD_PLACE, GET_PLACES} from "./actionTypes";
import {uiStartLoading, uiStopLoading} from "./ui"
import {authGetToken} from "./auth"

export const startAddPlace = () => {
  return {
    type: START_ADD_PLACE
  }
};

export const getPlaces = () => ({
  type: GET_PLACES
});

export const addPlace = (name, location, image) => {
  return (dispatch, getState) => {
    let authToken;
    dispatch(uiStartLoading());
    dispatch(authGetToken())
      .catch(() => alert('No valid token found'))
      .then(token => {
        authToken = token;
        return fetch('https://us-central1-memento-1530788482372.cloudfunctions.net/storeImage?auth=' + authToken, {
          method: 'POST',
          body: JSON.stringify({
            image: image.base64
          }),
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
      })
      .catch(err => {
        console.log(err);
        debugger;
        alert('Something went wrong, please try again!');
        dispatch(uiStopLoading());
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw (new Error())
        }
      })
      .then(parsedRes => {
        const placeData = {
          name,
          location,
          image: parsedRes.imageUrl,
          imagePath: parsedRes.imagePath
        };
        return fetch("https://memento-1530788482372.firebaseio.com/places.json?auth=" + authToken, {
          method: 'POST',
          body: JSON.stringify(placeData)
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw (new Error())
        }
      })
      .then(parsedRes => {
        console.log(parsedRes);
        dispatch(uiStopLoading());
        dispatch(placeAdded());
      })
      .catch(err => {
        console.log(err);
        alert('Something went wrong, please try again!');
        dispatch(uiStopLoading());
      })
  };
};

// export const getPlaces = () => {
//   return (dispatch, getState) => {
//     dispatch(authGetToken())
//       .catch(() => alert('No valid token found'))
//       .then(token => fetch("https://memento-1530788482372.firebaseio.com/places.json?auth=" + token))
//       .then(res => res.json())
//       .then(parsed => {
//         console.log('Parsed response');
//         console.log(parsed);
//         const places = [];
//         for (let key in parsed) {
//           places.push({
//             ...parsed[key],
//             key,
//             image: {
//               uri: parsed[key].image
//             }
//           });
//         }
//         dispatch(setPlaces(places))
//       })
//       .catch(err => {
//         console.log(err);
//         alert('Something went wrong, please try again!');
//       })
//   }
// };

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places
  }
};

export const deletePlace = (key) => {
  return dispatch => {
    dispatch(authGetToken())
      .catch(() => alert('No valid token found'))
      .then(token => {
        dispatch(removePlace(key));
        return fetch("https://memento-1530788482372.firebaseio.com/places/" + key + ".json?auth=" + token, {
          method: "DELETE"
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw (new Error())
        }
      })
      .then(parsedRes => {
        console.log("Done!");
      })
      .catch(err => {
        alert("Something went wrong, sorry :/");
        console.log(err);
      })
  };
};

export const removePlace = key => {
  return {
    type: REMOVE_PLACE,
    key: key
  };
};

export const placeAdded = () => {
  return {
    type: PLACE_ADDED
  }
};

