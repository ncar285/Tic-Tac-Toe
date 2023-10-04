// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQdqu7f9ZQHd0qvcNgAuRpBH2My67qyRs",
  authDomain: "tic-tac-toe-2player-7d66c.firebaseapp.com",
  projectId: "tic-tac-toe-2player-7d66c",
  storageBucket: "tic-tac-toe-2player-7d66c.appspot.com",
  messagingSenderId: "213971015130",
  appId: "1:213971015130:web:7b032747990e94243a5ce3",
  measurementId: "G-NDS4B49HQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const database = getDatabase(app);
export default database;