import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyC1CZ1S4grsDPMYrBjumJ-QZxjl2sRdmgE",
  authDomain: "memento-1530788482372.firebaseapp.com",
  databaseURL: "https://memento-1530788482372.firebaseio.com",
  projectId: "memento-1530788482372",
  storageBucket: "memento-1530788482372.appspot.com",
  messagingSenderId: "233589417056"
};

firebase.initializeApp(config);

export let firebaseRef = firebase.database().ref();

export default firebase;