
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';

try {
  const config = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    storageBucket: process.env.STORAGE_BUCKET,
    projectId: process.env.PROJECT_ID,
    messagingSenderId: process.env.MESSAGING_SENDER_ID
  };
  firebase.initializeApp(config);
} catch (e) {

}

export let firebaseRef = firebase.database().ref();
export const BASE_FB_URL = 'https://memento-1530788482372.firebaseio.com';

export default firebase;