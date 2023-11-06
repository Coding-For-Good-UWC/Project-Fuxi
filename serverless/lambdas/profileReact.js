'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb } = require('../lib/mongodb');

const trackModel = require('../models/track');
const profileReactModel = require('../models/profileReact');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const getReactTrackByProfileId = async (event) => {
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const response = await profileReactModel.find({ profileId: new ObjectId(profileId) });
        if (response) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Data retrieved successfully.', response[0]));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile with this ID was not found.'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const getLikeTrackByProfileId = async (event) => {
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const response = await profileReactModel
            .find({
                profileId: profileId,
                'reactTracks.preference': { $in: ['like', 'strongly like'] },
            })
            .populate('reactTracks.track');
        if (response) {
            return JSON.stringify(
                ApiResponse.success(
                    HttpStatus.OK,
                    'Data retrieved successfully.',
                    response[0].reactTracks.filter((item) => item.preference === 'like' || item.preference === 'strongly like'),
                ),
            );
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile with this ID was not found.'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const createProfileReact = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, reactTracks } = json;
    if (!profileId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const response = await profileReactModel.create({ profileId, reactTracks });
        if (response) {
            return JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Created react profile success', response));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const addReactTrack = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackId, preference } = json;
    if (!profileId || !trackId || !preference) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const updatedReactTrack = await profileReactModel.findOneAndUpdate(
            { profileId: profileId },
            {
                $push: {
                    reactTracks: {
                        track: new ObjectId(trackId),
                        preference: preference,
                    },
                },
            },
        );
        if (updatedReactTrack) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added a new react track success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const updateReactTrack = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackId, preference } = json;
    if (!profileId || !trackId || !preference) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const updatedReactTrack = await profileReactModel.findOneAndUpdate(
            {
                profileId: profileId,
                'reactTracks.track': new ObjectId(trackId),
            },
            {
                $set: {
                    'reactTracks.$.preference': preference,
                },
            },
        );
        if (updatedReactTrack) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Updated react track preference success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'React track not found'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const removeReactTrack = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackId } = json;
    if (!profileId || !trackId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const updatedProfile = await profileReactModel.findOneAndUpdate(
            { profileId: profileId },
            {
                $pull: {
                    reactTracks: { track: new ObjectId(trackId) },
                },
            },
        );
        if (updatedProfile) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed a react track success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const deleteProfileReact = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId } = json;
    if (!profileId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const existingReactTrack = await profileReactModel.deleteOne({ profileId: new ObjectId(profileId) });

        if (existingReactTrack.deletedCount > 0) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Deleted react profile success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'React profile not found'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

module.exports = {
    getReactTrackByProfileId,
    getLikeTrackByProfileId,
    createProfileReact,
    addReactTrack,
    updateReactTrack,
    removeReactTrack,
    deleteProfileReact,
};
