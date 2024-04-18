import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCLZYwTj7dRSlC6lGgh1JsbLecE9Xmq-yg",
    authDomain: "gtamodz-c364e.firebaseapp.com",
    projectId: "gtamodz-c364e",
    storageBucket: "gtamodz-c364e.appspot.com",
    messagingSenderId: "234238757587",
    appId: "1:234238757587:web:f122a2b5e8ffcc2ca96226"
  };

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }



