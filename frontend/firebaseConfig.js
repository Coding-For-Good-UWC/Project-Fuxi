import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyA8TIuruwyk5H86oxNfSpzCbsz70uYIbCs',
  authDomain: 'project-fuxi-6edd2.firebaseapp.com',
//   databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-fuxi-6edd2',
//   storageBucket: 'project-id.appspot.com',
//   messagingSenderId: 'sender-id',
  appId: '1:1099222569385:ios:11c53e494e3aac8df434b8',
//   measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const auth = getAuth(app);
