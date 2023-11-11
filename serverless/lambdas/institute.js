'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDb } = require('../lib/mongodb');
const { InstituteModel } = require('../models/institute');
const { generateRandomString } = require('../utils/index');
const { ResetPasswordEmail } = require('../utils/mailer');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const signup = async (event) => {
    const { email, name, password } = JSON.parse(event.body);
    if (!email || !name || !password) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    const institute = await InstituteModel.findOne({ email: email }).exec();
    if (!institute) {
        const userUid = generateRandomString(28);
        const createToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
        const newInStitutes = await InstituteModel.create({ uid: userUid, email, name, password });
        return {
            statusCode: 201,
            body: JSON.stringify(
                ApiResponse.success(HttpStatus.OK, 'Account successfully created', {
                    institute: {
                        id: newInStitutes._id,
                        uid: userUid,
                        email: email,
                        name: name,
                    },
                    token: createToken,
                }),
            ),
        };
    } else {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.CONFLICT, 'User with email already exists')) };
    }
};

const signin = async (event) => {
    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    const institute = await InstituteModel.findOne({ email: email }).exec();
    if (!institute) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Email ID or password is invalid')) };
    } else {
        const resultPassword = await bcryptjs.compare(password, institute.password);
        if (resultPassword) {
            const createToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
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
    const json = JSON.parse(event.body);
    const { email } = json;
    if (!email) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    await InstituteModel.findOneAndUpdate({ email: email }, { $set: { OTPResetPassword: randomNumber } }, { upsert: false });

    const result = await ResetPasswordEmail(email, randomNumber);
    console.log('result send email: ' + result);
    if (result === 200) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Email sent successfully!', token)) };
    } else {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Error sending email')) };
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
