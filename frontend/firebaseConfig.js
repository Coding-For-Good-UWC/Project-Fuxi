import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyA8TIuruwyk5H86oxNfSpzCbsz70uYIbCs',
  authDomain: 'project-fuxi-6edd2.firebaseapp.com',
  projectId: 'project-fuxi-6edd2',
  appId: '1:1099222569385:ios:11c53e494e3aac8df434b8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
