import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAl08ocy8nN4XcVsPoRq-DArSTMdFrB1zo',
    authDomain: 'fuxi-app.firebaseapp.com',
    projectId: 'fuxi-app',
    storageBucket: 'fuxi-app.appspot.com',
    messagingSenderId: '312659603389',
    appId: '1:312659603389:web:7b349494f867f67c7eecd4',
    measurementId: 'G-CTP5R8MDW2',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
