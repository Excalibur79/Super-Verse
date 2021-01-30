import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyB-IWUrwfkU-_JcpkreoAUUhGQcCjwuA_4",
    authDomain: "multiplayer-card-game-301207.firebaseapp.com",
    projectId: "multiplayer-card-game-301207",
    storageBucket: "multiplayer-card-game-301207.appspot.com",
    messagingSenderId: "501841594280",
    appId: "1:501841594280:web:6e29815c0ee194e66fbf9d",
    measurementId: "G-CVW4ZMZYRB"
  };

  firebase.initializeApp(firebaseConfig);
  //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

  export default firebase;