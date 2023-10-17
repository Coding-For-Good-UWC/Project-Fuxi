'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const { connectDb } = require('../lib/mongodb');
const { firebaseConfig } = require('../config/config');
const instituteModel = require('../models/institute');
const patientModel = require('../models/patient');
const { createUserFirebase, loginWithCredentials, authenticationToken } = require('../middlewares/index');

connectDb();
firebaseConfig();

const getPatients = async (event) => {
    try {
        console.log(event.body);
        const { uid } = JSON.parse(event.body);
        console.log(uid);

        if (!uid) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'Institute ID is required' },
            });
        }

        const institute = await instituteModel.findOne({ uid: uid });

        if (!institute) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'Institute not found' },
            });
        }

        const patients = await patientModel.find({ institute: institute._id });

        return JSON.stringify({
            statusCode: 200,
            body: {
                patients,
                status: 'OK',
                message: 'Patients retrieved successfully',
            },
        });
    } catch (err) {
        return JSON.stringify({
            statusCode: 500,
            body: { status: 'ERROR', message: 'Server error' },
        });
    }
};

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

        console.log(institute);

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

const verify = async (event) => {
    const json = JSON.parse(event.body);
    return JSON.stringify({
        statusCode: 200,
        body: { status: 'OK', message: 'Verified', uid: json.uid },
    });
};

const getInstitute = async (event) => {
    const json = JSON.parse(event.body);
    const { id, authtoken } = json;

    const uidAuth = await authenticationToken(authtoken);

    if (id !== uidAuth) {
        return JSON.stringify({
            statusCode: 400,
            body: {
                status: 'ERROR',
                message: 'Invalid credentials',
            },
        });
    }

    const institute = await instituteModel.findOne({ uid: id });

    if (!institute) {
        return JSON.stringify({
            statusCode: 400,
            body: {
                status: 'ERROR',
                message: 'Institute not found',
            },
        });
    }

    return JSON.stringify({
        statusCode: 200,
        body: {
            message: 'Get Institute',
            institute,
            status: 'OK',
        },
    });
};

const checkNameRepeat = async (event) => {
    console.log(event);
    const { name } = event.queryStringParameters;
    console.log(name);
    const institute = instituteModel.findOne({ name: name });
    console.log(institute);
    if (institute == null) {
        return JSON.stringify({
            statusCode: 200,
            body: JSON.stringify(institute), // Stringify the response body
        });
    } else {
        return JSON.stringify({
            statusCode: 400,
            body: {
                status: 'ERROR',
                message: 'same',
            },
        });
    }
};

module.exports = {
    getPatients,
    signup,
    signin,
    verify,
    getInstitute,
    checkNameRepeat,
};
