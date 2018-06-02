import { firebase } from "@firebase/app";

window.firebase = firebase;

import "@firebase/firestore";

const firebaseApp = firebase.initializeApp({

  apiKey: "AIzaSyCJzIWWs2JGVTOofSnU5Fi3REygVZTaMpM",
  authDomain: "amadeushack-c3157.firebaseapp.com",
  databaseURL: "https://amadeushack-c3157.firebaseio.com",
  projectId: "amadeushack-c3157",
  storageBucket: "amadeushack-c3157.appspot.com",
  messagingSenderId: "711050139486"
});

export const db = firebaseApp.firestore();
window.db = db;

