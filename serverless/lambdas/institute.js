'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config();
const admin = require('firebase-admin');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDb } = require('../lib/mongodb');
const { InstituteModel } = require('../models/institute');
const { createUserFirebase, loginWithCredentials, authenticationToken } = require('../middlewares/index');
const { ResetPasswordEmail } = require('../utils/mailer');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const signup = async (event) => {
    const { email, name, password } = JSON.parse(event.body);
    if (!email || !name || !password) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        const userUid = await createUserFirebase(email, password);
        if (userUid) {
            const newInstitute = await InstituteModel.create({ uid: userUid, email, name, password });
            console.log(newInstitute);
            if (newInstitute) {
                const createToken = await admin.auth().createCustomToken(userUid);
                return {
                    statusCode: 201,
                    body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'InstituteModel created', { userUid: userUid, token: createToken })),
                };
            } else {
                return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
            }
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.CONFLICT, 'User with email already exists')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const signin = async (event) => {
    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    const credentials = await loginWithCredentials(email);
    if (credentials === null) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Email ID or password is invalid')) };
    }

    const institute = await InstituteModel.findOne({ email: email }).exec();
    if (!institute) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Email ID or password is invalid')) };
    } else {
        const resultPassword = await bcryptjs.compare(password, institute.password);
        if (resultPassword) {
            const createToken = await admin.auth().createCustomToken(credentials.uid);
            return {
                statusCode: 200,
                body: JSON.stringify(
                    ApiResponse.success(HttpStatus.OK, 'Successfully signed in', {
                        institute: {
                            id: institute._id,
                            uid: institute.uid,
                            email: institute.email,
                            name: institute.name,
                        },
                        token: createToken,
                    }),
                ),
            };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Email ID or password is invalid')) };
        }
    }
};

const resetPassword = async (event) => {
    const { email } = JSON.parse(event.body);
    if (!email) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    await InstituteModel.findOneAndUpdate({ email: email }, { $set: { OTPResetPassword: randomNumber } }, { upsert: false });

    try {
        const result = await ResetPasswordEmail(email, randomNumber);
        if (result === 200) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Email sent successfully!', token)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Error sending email')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const changePassword = async (event) => {
    const { email, oldPassword, newPassword } = JSON.parse(event.body);
    if (!email || !oldPassword || !newPassword) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        const institute = await InstituteModel.findOne({ email: email });
        if (!institute) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'User not found')) };
        }

        const passwordMatch = await bcryptjs.compare(oldPassword, institute.password);
        if (!passwordMatch) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Invalid old password')) };
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        await InstituteModel.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });

        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Password changed successfully')) };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred')) };
    }
};

const changePasswordInReset = async (event) => {
    const { token, OTP, newPassword } = JSON.parse(event.body);
    if (!token || !OTP || !newPassword) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = decoded.email;

        if (email) {
            const tokenExpirationTime = decoded.exp;
            const currentTime = Math.floor(Date.now() / 1000);

            if (currentTime <= tokenExpirationTime) {
                const institute = await InstituteModel.findOne({ email: email });

                if (!institute) {
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'User not found')) };
                }

                if (OTP === institute.OTPResetPassword) {
                    const salt = await bcryptjs.genSalt(10);
                    const hashedPassword = await bcryptjs.hash(newPassword, salt);

                    await InstituteModel.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Password changed successfully')) };
                } else {
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'OTP code is invalid')) };
                }
            } else {
                return {
                    statusCode: 403,
                    body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'The provided token has expired. Please obtain a new token')),
                };
            }
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Email information not found in token')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred')) };
    }
};

module.exports = {
    signup,
    signin,
    resetPassword,
    changePassword,
    changePasswordInReset,
};
