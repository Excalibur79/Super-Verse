import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAsrQ8cx3K1Kgn5BFa9PNcafyhNpxezN08",
    authDomain: "superverse-ac3a1.firebaseapp.com",
    projectId: "superverse-ac3a1",
    storageBucket: "superverse-ac3a1.firebasestorage.app",
    messagingSenderId: "220427494696",
    appId: "1:220427494696:web:71f556d74640dce1d1dc1d"
  };

  firebase.initializeApp(firebaseConfig);
  //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

  export default firebase;