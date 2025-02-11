// Import the functions you need from the SDKs you need
import {getApps, initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXwCqXW8djHF3idJqffrY5ZhSL9gqtinY",
    authDomain: "notion-clone-e200e.firebaseapp.com",
    projectId: "notion-clone-e200e",
    storageBucket: "notion-clone-e200e.firebasestorage.app",
    messagingSenderId: "956560920630",
    appId: "1:956560920630:web:2731762abb23ec142a0897"
};

// Initialize Firebase
let app;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

const db = getFirestore(app);

export {db};
