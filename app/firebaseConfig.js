// app/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxqLCaG4pK1WvbPqHZj04OgXiPqp0jze0",
  authDomain: "pantry-tracker-5bee1.firebaseapp.com",
  databaseURL: "https://pantry-tracker-5bee1-default-rtdb.firebaseio.com",
  projectId: "pantry-tracker-5bee1",
  storageBucket: "pantry-tracker-5bee1.appspot.com",
  messagingSenderId: "35948227754",
  appId: "1:35948227754:web:df06138661af809e83b4d3",
  measurementId: "G-BYC1GF30SZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
