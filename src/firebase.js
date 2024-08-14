// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTXMGOipK9K8xsBWy0YcaGaHXcwzJXjfg",
  authDomain: "vlbackend-5052c.firebaseapp.com",
  projectId: "vlbackend-5052c",
  storageBucket: "vlbackend-5052c.appspot.com",
  messagingSenderId: "1018044969557",
  appId: "1:1018044969557:web:38467ea1a1ff4ca967dadc",
  measurementId: "G-ETSHYN0M0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);