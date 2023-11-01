'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config();
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connectDb } = require('../lib/mongodb');
const { firebaseConfig } = require('../config/config');
const instituteModel = require('../models/institute');
const { createUserFirebase, loginWithCredentials, authenticationToken } = require('../middlewares/index');
const { ResetPasswordEmail } = require('../utils/mailer');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

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

const resetPassword = async (event) => {
    const { email } = JSON.parse(event.body);
    if (!email) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    await instituteModel.findOneAndUpdate({ email: email }, { $set: { OTPResetPassword: randomNumber } }, { upsert: false });

    try {
        const result = await ResetPasswordEmail(email, randomNumber);
        if (result === 200) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Email sent successfully!', token));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Error sending email'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const changePassword = async (event) => {
    const { email, oldPassword, newPassword } = JSON.parse(event.body);
    if (!email || !oldPassword || !newPassword) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }

    try {
        const institute = await instituteModel.findOne({ email: email });

        if (!institute) {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'User not found'));
        }

        const passwordMatch = await bcrypt.compare(oldPassword, institute.password);

        if (!passwordMatch) {
            return JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Invalid old password'));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await instituteModel.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });

        return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Password changed successfully'));
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred'));
    }
};

const changePasswordInReset = async (event) => {
    const { token, OTP, newPassword } = JSON.parse(event.body);
    if (!token || !OTP || !newPassword) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = decoded.email;

        if (email) {
            const tokenExpirationTime = decoded.exp;
            const currentTime = Math.floor(Date.now() / 1000);

            if (currentTime <= tokenExpirationTime) {
                const institute = await instituteModel.findOne({ email: email });

                if (!institute) {
                    return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'User not found'));
                }

                if (OTP === institute.OTPResetPassword) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(newPassword, salt);

                    await instituteModel.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
                    return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Password changed successfully'));
                } else {
                    return JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'OTP code is invalid'));
                }
            } else {
                return JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'The provided token has expired. Please obtain a new token'));
            }
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Email information not found in token'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred'));
    }
};

module.exports = {
    signup,
    signin,
    resetPassword,
    changePassword,
    changePasswordInReset,
};
