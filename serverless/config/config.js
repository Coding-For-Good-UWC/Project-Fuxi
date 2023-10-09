var admin = require('firebase-admin');
const firebase = require('../firebase.json');

// const {
//     FIREBASE_PRIVATE_KEY_ID,
//     FIREBASE_PRIVATE_KEY,
//     FIREBASE_CLIENT_EMAIL,
//     FIREBASE_CLIENT_ID,
//     FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     FIREBASE_CLIENT_X509_CERT_URL,
// } = process.env;

// var serviceAccount = {
//     type: 'service_account',
//     project_id: 'project-fuxi-6edd2',
//     private_key_id: FIREBASE_PRIVATE_KEY_ID,
//     private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     client_email: FIREBASE_CLIENT_EMAIL,
//     client_id: FIREBASE_CLIENT_ID,
//     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//     token_uri: 'https://oauth2.googleapis.com/token',
//     auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
// };

const firebaseConfig = () => {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(firebase),
        });
        console.log('Firebase Admin SDK has been initialized successfully.');
    } catch (error) {
        console.error('Error initializing Firebase Admin SDK:', error);
    }
};

module.exports = { firebaseConfig };
