'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb, closeDb } = require('../lib/mongodb');
const { ProfileModel } = require('../models/profile');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const getAllProfilesByInstituteUId = async (event) => {
    const { uid } = event.queryStringParameters;
    if (!uid) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const profiles = await ProfileModel.find({ uid: uid });
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all profile success', profiles)) };
    } catch (err) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const getProfileById = async (event) => {
    const { id } = event.queryStringParameters;
    if (!id) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const profile = await ProfileModel.findOne({ _id: new ObjectId(id) });
        if (!profile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all profile success', profile)) };
    } catch (err) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const createProfile = async (event) => {
    const json = JSON.parse(event.body);
    const { instituteUid, fullname, yearBirth, genres } = json;
    if (!instituteUid || !fullname || !yearBirth || !genres) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const profile = await ProfileModel.create({
            uid: instituteUid,
            fullname,
            yearBirth,
            genres,
        });
        if (profile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Profile created success', profile)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const deleteProfile = async (event) => {
    const json = JSON.parse(event.body);
    const { id } = json;
    if (!id) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const deleteProfile = await ProfileModel.findByIdAndDelete(id);
        if (deleteProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte profile success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const updateProfile = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, fullname, yearBirth, genres } = json;
    if (!profileId || !fullname || !yearBirth) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const exitsUpdateProfile = await ProfileModel.findOneAndUpdate(
            { _id: new ObjectId(profileId) },
            {
                $set: {
                    fullname,
                    yearBirth,
                    genres,
                },
            },
            { new: true }
        );
        if (exitsUpdateProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Update profile success', exitsUpdateProfile)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

module.exports = { getAllProfilesByInstituteUId, getProfileById, createProfile, deleteProfile, updateProfile };
