'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const { connectDb } = require('../lib/mongodb');
const { firebaseConfig } = require('../config/config');
const instituteModel = require('../models/institute');
const { createUserFirebase, loginWithCredentials, authenticationToken } = require('../middlewares/index');

connectDb();
firebaseConfig();

const signup = async (event) => {
    const { email, name, password } = JSON.parse(event.body);
    if (!email || !name || !password) {
        return JSON.stringify({
            statusCode: 400,
            body: {
                status: 'ERROR',
                message: 'Missing required fields',
            },
        });
    }

    try {
        const userUid = await createUserFirebase(email, password);
        if (userUid) {
            const newInstitute = await instituteModel.create({
                uid: userUid,
                email,
                name,
                password,
            });
            if (newInstitute) {
                const createToken = await admin.auth().createCustomToken(userUid);
                return JSON.stringify({
                    statusCode: 200,
                    body: {
                        status: 'OK',
                        message: 'Institute created',
                        userUid: userUid,
                        token: createToken,
                    },
                });
            } else {
                return JSON.stringify({
                    statusCode: 500,
                    body: {
                        status: 'Internal server error',
                        message: 'Server Error',
                    },
                });
            }
        } else {
            return JSON.stringify({
                statusCode: 409,
                body: {
                    status: 'Conflict',
                    message: 'User with email already exists',
                },
            });
        }
    } catch (err) {
        console.error(err);
        return JSON.stringify({
            statusCode: 502,
            body: {
                status: 'Bad Gateway',
                message: err.message,
            },
        });
    }
};

const signin = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);
        if (!email || !password)
            return JSON.stringify({
                statusCode: 400,
                message: 'Missing required fields',
            });

        const credentials = await loginWithCredentials(email);
        const createToken = await admin.auth().createCustomToken(credentials.uid);

        const institute = await instituteModel.findOne({ uid: credentials.uid }).exec();
        const resultPassword = await bcrypt.compare(password, institute.password);

        if (!institute) {
            return JSON.stringify({
                statusCode: 400,
                message: 'Invalid credentials',
            });
        } else {
            if (resultPassword) {
                return JSON.stringify({
                    statusCode: 200,
                    message: 'Successfully signed in',
                    institute: {
                        id: institute._id,
                        uid: institute.uid,
                        email: institute.email,
                        name: institute.name,
                    },
                    token: createToken,
                });
            } else {
                return JSON.stringify({
                    statusCode: 401,
                    message: 'Incorrect password',
                });
            }
        }
    } catch (err) {
        console.log(err);
        return JSON.stringify({ statusCode: 500, message: 'Server error' });
    }
};

module.exports = {
    signup,
    signin,
};
