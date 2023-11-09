const admin = require('firebase-admin');
const firebase = require('../firebase.json');

let cachedFirebase = null;

const firebaseConfig = () => {
    if (cachedFirebase) {
        return cachedFirebase;
    }
    try {
        cachedFirebase = admin.initializeApp({
            credential: admin.credential.cert(firebase),
        });
        console.log('Firebase Admin SDK has been initialized successfully.');
        return cachedFirebase;
    } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
    }
};

module.exports = { firebaseConfig };
