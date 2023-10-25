'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb } = require('../lib/mongodb');
const instituteModel = require('../models/institute');
const profileModel = require('../models/profile');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const getAllProfilesByInstituteUId = async (event) => {
    try {
        const { uid } = event.queryStringParameters;
        if (!uid) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }
        const institute = await instituteModel.find({ uid: uid });
        if (!institute) {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Institute not found'));
        }
        const profiles = await profileModel.find({ uid: uid });
        return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all profile success', profiles));
    } catch (err) {
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const getProfileById = async (event) => {
    try {
        const { id } = event.queryStringParameters;
        if (!id) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }
        const profile = await profileModel.findOne({ _id: new ObjectId(id) });
        if (!profile) {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found'));
        }
        return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all profile success', profile));
    } catch (err) {
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const createProfile = async (event) => {
    try {
        const json = JSON.parse(event.body);
        const { instituteUid, fullname, yearBirth, genres, description } = json;
        if (!instituteUid || !fullname || !yearBirth || !genres) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }
        const profile = await profileModel.create({
            uid: instituteUid,
            fullname,
            yearBirth,
            genres,
            description,
        });
        if (profile) {
            return JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Profile created success', profile));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure'));
        }
    } catch (err) {
        console.log(err);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const deleteProfile = async (event) => {
    try {
        const { id } = event.queryStringParameters;
        if (!id) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }
        const deleteProfile = await profileModel.findByIdAndDelete(id);
        if (deleteProfile) {
            return JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte profile success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found'));
        }
    } catch (err) {
        console.log(err);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const updateProfile = async (event) => {
    try {
        const json = JSON.parse(event.body);
        const { id, fullname, yearBirth, language, genres, description } = json;
        if (!id || !fullname || !yearBirth) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }
        const updateProfile = await profileModel.findOneAndUpdate(
            { _id: new ObjectId(id) },
            {
                $set: {
                    fullname,
                    yearBirth,
                    language,
                    genres,
                    description,
                },
            },
            { new: true },
        );
        if (updateProfile) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Update profile success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found'));
        }
    } catch (err) {
        console.log(err);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

module.exports = { getAllProfilesByInstituteUId, getProfileById, createProfile, deleteProfile, updateProfile };
