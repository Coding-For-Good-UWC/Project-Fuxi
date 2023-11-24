'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDb } = require('../lib/mongodb');
const { InstituteModel } = require('../models/institute');
const { ProfileModel } = require('../models/profile');
const { ProfileReactModal } = require('../models/profileReact');
const { PlaylistModel } = require('../models/playlist');
const { generateRandomString } = require('../utils/index');
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
                })
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
                    })
                ),
            };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Email ID or password is invalid')) };
        }
    }
};

const updateOTP = async (event) => {
    const json = JSON.parse(event.body);
    const { email, CodeOTP } = json;
    if (!email || !CodeOTP) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    const salt = await bcryptjs.genSalt(10);
    const hashedOTP = await bcryptjs.hash(String(CodeOTP), salt);

    try {
        await InstituteModel.findOneAndUpdate({ email: email }, { $set: { OTPResetPassword: hashedOTP } }, { upsert: false });
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Email sent successfully!', token)) };
    } catch (error) {
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

                const resultOTP = bcryptjs.compare(OTP.toString(), institute.OTPResetPassword);

                if (resultOTP) {
                    const salt = await bcryptjs.genSalt(10);
                    const hashedPassword = await bcryptjs.hash(newPassword, salt);

                    await InstituteModel.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Password changed successfully')) };
                } else {
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'OTP code is invalid')) };
                }
            } else {
                return {
                    statusCode: 200,
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

const deleteAccount = async (event) => {
    const { email } = JSON.parse(event.body);
    if (!email) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const existUser = await InstituteModel.findOneAndDelete({ email: email });

        if (existUser) {
            const profilesToDelete = await ProfileModel.find({ uid: existUser.uid });
            for (const profile of profilesToDelete) {
                await PlaylistModel.deleteMany({ profileId: profile._id });
                await ProfileReactModal.deleteOne({ profileId: profile._id });
            }
            await ProfileModel.deleteMany({ uid: existUser.uid });
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Account Deleted Successfully!')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Account Deletion Unsuccessful')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const verifyAccount = async (event) => {
    const { token, OTP } = JSON.parse(event.body);
    if (!token || !OTP) {
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

                const resultOTP = bcryptjs.compare(OTP.toString(), institute.OTPResetPassword);

                if (resultOTP) {
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Account verified successfully')) };
                } else {
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Invalid OTP code')) };
                }
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Token has expired. Please obtain a new token')),
                };
            }
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Email information not found in token')) };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 200,
            body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred during account verification')),
        };
    }
};

module.exports = {
    signup,
    signin,
    updateOTP,
    changePassword,
    changePasswordInReset,
    deleteAccount,
    verifyAccount,
};
