// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd36MpIF3WyazHzWSOoXS_GbAx2HtIWqQ",
  authDomain: "movie-app-auth-aa416.firebaseapp.com",
  projectId: "movie-app-auth-aa416",
  storageBucket: "movie-app-auth-aa416.firebasestorage.app",
  messagingSenderId: "524132231069",
  appId: "1:524132231069:web:993b38c8491cd2f7b7f174"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//* Initialize Firebase auth and get a reference to the service
export const auth = getAuth(app);


