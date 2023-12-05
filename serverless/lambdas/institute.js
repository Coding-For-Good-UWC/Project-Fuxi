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
    // verify field
    if (!email || !name || !password) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    const institute = await InstituteModel.findOne({ email: email }).exec();
    if (!institute) {
        const userUid = generateRandomString(28);
        // create jwt token containing email
        const createToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
        // create user and save it in the database
        const newInStitutes = await InstituteModel.create({ uid: userUid, email, name, password, isVerifyAuth: false });
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
    // verify field
    if (!email || !password) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    // Check to see if the user already exists in the database. If it exists, log in
    const institute = await InstituteModel.findOne({ email: email }).exec();
    if (!institute) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Email ID or password is invalid')) };
    } else {
        // Compare the password the user entered and the hashed password
        const resultPassword = await bcryptjs.compare(password, institute.password);
        if (resultPassword) {
            // create token
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
                        isVerifyAuth: institute.isVerifyAuth,
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
    // verify field
    if (!email || !CodeOTP) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    // Create tokens with a duration of 1 hour
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // creates a salt with complexity 10
    const salt = await bcryptjs.genSalt(10);
    // hash OTP
    const hashedOTP = await bcryptjs.hash(String(CodeOTP), salt);

    // Find the user by email and update the hashedOTP into the database. If found, save it
    try {
        await InstituteModel.findOneAndUpdate({ email: email }, { $set: { OTPResetPassword: hashedOTP } }, { upsert: false });
        // Send token to frontend
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Email sent successfully!', token)) };
    } catch (error) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Error sending email')) };
    }
};

const changePassword = async (event) => {
    const { email, oldPassword, newPassword } = JSON.parse(event.body);
    // verify field
    if (!email || !oldPassword || !newPassword) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // Find the user by email
        const institute = await InstituteModel.findOne({ email: email });
        // If user does not exist, an error is returned
        if (!institute) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'User not found')) };
        }

        // Compare old password and new password
        const passwordMatch = await bcryptjs.compare(oldPassword, institute.password);
        // If there is no match, an error will be returned
        if (!passwordMatch) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.UNAUTHORIZED, 'Invalid old password')) };
        }

        const salt = await bcryptjs.genSalt(10);
        // Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Find the user by email and update the new password into the database
        await InstituteModel.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });

        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Password changed successfully')) };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'An error occurred')) };
    }
};

const changePasswordInReset = async (event) => {
    const { token, OTP, newPassword } = JSON.parse(event.body);
    // verify field
    if (!token || !OTP || !newPassword) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // decode the jwt token and retrieve the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = decoded.email;

        if (email) {
            // Get the token expiration time from the decoded information
            const tokenExpirationTime = decoded.exp;

            // Get the current time and convert it to seconds
            const currentTime = Math.floor(Date.now() / 1000);

            // Check if the current time is less than or equal to the token expiration time
            if (currentTime <= tokenExpirationTime) {
                const institute = await InstituteModel.findOne({ email: email });

                // If user does not exist, an error is returned
                if (!institute) {
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'User not found')) };
                }

                // Compare OTP and OTP has been saved in the database
                const resultOTP = await bcryptjs.compare(OTP.toString(), institute.OTPResetPassword);

                // If the OTP is correct, hash the new password and store it in the database
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
    // verify field
    if (!email) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // Find the user by email
        const existUser = await InstituteModel.findOneAndDelete({ email: email });

        // If the user is found, proceed to delete all information related to the user
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
    // verify field
    if (!token || !OTP) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // decode the jwt token and retrieve the email
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const email = decoded.email;

        if (email) {
            // Get the token expiration time from the decoded information
            const tokenExpirationTime = decoded.exp;

            // Get the current time and convert it to seconds
            const currentTime = Math.floor(Date.now() / 1000);

            // Check if the current time is less than or equal to the token expiration time
            if (currentTime <= tokenExpirationTime) {
                // Find the user by email
                const institute = await InstituteModel.findOne({ email: email });

                if (!institute) {
                    return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'User not found')) };
                }

                // Compare OTP and OTP has been saved in the database
                const resultOTP = await bcryptjs.compare(OTP.toString(), institute.OTPResetPassword);

                if (resultOTP) {
                    // Set isVerifyAuth to true so that when the user logs back in, they will no longer need to verify
                    await InstituteModel.findOneAndUpdate({ email: email }, { $set: { isVerifyAuth: true } });

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
