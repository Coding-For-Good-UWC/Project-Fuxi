const NodeRSA = require('node-rsa');
const jwt = require('jsonwebtoken');
const firebase = require('../firebase.json');
const publicKey = new NodeRSA().importKey(firebase.private_key, 'pkcs8-private-pem').exportKey('pkcs8-public-pem');

const decodeJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      publicKey,
      {
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded.uid);
        }
      },
    );
  });
};

module.exports = { decodeJWT };
