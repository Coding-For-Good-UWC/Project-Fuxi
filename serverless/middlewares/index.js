const admin = require('firebase-admin');
const { decodeJWT } = require('../middlewares/decode');

const authenticationToken = async (userToken) => {
  try {
    if (userToken) {
      const decodedToken = await decodeJWT(userToken);
      console.log(decodedToken);
      return decodedToken;
    } else {
      return JSON.stringify({ statusCode: 401, message: 'Unauthorized' });
    }
  } catch (err) {
    console.log(err);
    return JSON.stringify({ statusCode: 500, message: 'Internal Server Error' });
  }
};

const createUserFirebase = async (email, password) => {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    console.log('User created successfully:', userRecord.uid);
    return userRecord.uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const loginWithCredentials = async (email) => {
  try {
    // signInWithEmailAndPassword -> Firebase Authentication SDK
    // getUserByEmail -> Firebase Admin SDK
    const userCredential = await admin.auth().getUserByEmail(email);
    console.log('Successfully logged in with email:', userCredential.email);
    return userCredential;
  } catch (error) {
    console.error('Error signing in user:', error);
    throw error;
  }
};

module.exports = { authenticationToken, createUserFirebase, loginWithCredentials };
