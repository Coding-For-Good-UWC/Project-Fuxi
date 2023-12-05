'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb, closeDb } = require('../lib/mongodb');
const { TrackModel } = require('../models/track');
const { ProfileReactModal } = require('../models/profileReact');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');
const { getScoreByPreference } = require('../utils/index');

connectDb();

const getReactTrackByProfileId = async (event) => {
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await ProfileReactModal.find({ profileId: new ObjectId(profileId) }).populate('reactTracks.track');
        if (response) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Data retrieved successfully.', response[0])) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile with this ID was not found.')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const getLikeTrackByProfileId = async (event) => {
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // Fetch react information for the specified profileId and populate associated track information
        const response = await ProfileReactModal.find({ profileId: new ObjectId(profileId) }).populate('reactTracks.track');

        // Extract tracks with a preference of 'like' or 'strongly like'
        const tracksLike = response[0].reactTracks.filter((item) => item.preference === 'like' || item.preference === 'strongly like');

        // Remove duplicate tracks based on their IDs
        const uniqueTracks = Array.from(new Set(tracksLike.map((track) => track._id))).map((_id) => {
            // Find the first occurrence of the track with the given ID
            return tracksLike.find((track) => track._id === _id);
        });

        if (response) {
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Data retrieved successfully.', uniqueTracks)),
            };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile with this ID was not found.')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const createProfileReact = async (profileId, reactTracks) => {
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await ProfileReactModal.create({ profileId: profileId, reactTracks: reactTracks });
        if (response) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Created react profile success', response)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const getReactTrackByTrackId = async (event) => {
    const { profileId, trackId } = event.queryStringParameters;
    if (!profileId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await ProfileReactModal.findOne({ profileId: profileId });
        const desiredObject = response.reactTracks.find((item) => item.track.equals(new ObjectId(trackId)));
        if (response) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get the react track', desiredObject)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'React track not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const addReactTrack = async (event) => {
    await connectDb();
    const json = JSON.parse(event.body);
    const { profileId, trackId, preference } = json;
    if (!profileId || !trackId || !preference) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // Update the ProfileReactModal collection
        const updatedReactTrack = await ProfileReactModal.findOneAndUpdate(
            { profileId: profileId },
            {
                $push: {
                    reactTracks: {
                        // Include the track ID, preference, and calculated score in the new react track entry
                        track: new ObjectId(trackId),
                        preference: preference,
                        score: getScoreByPreference(preference),
                    },
                },
            },
            // Set the option to return the modified document after the update
            { new: true }
        );

        if (updatedReactTrack) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added a new react track success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const updateReactTrack = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackId, preference } = json;
    if (!profileId || !trackId || !preference) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // Update the ProfileReactModal collection by finding the specific react track entry
        const updatedReactTrack = await ProfileReactModal.findOneAndUpdate(
            {
                profileId: profileId,
                'reactTracks.track': new ObjectId(trackId),
            },
            {
                // Set the new values for the preference and score fields in the found react track entry
                $set: {
                    'reactTracks.$.preference': preference,
                    'reactTracks.$.score': getScoreByPreference(preference),
                },
            },
            // Set the option to return the modified document after the update
            { new: true }
        );
        if (updatedReactTrack) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Updated react track preference success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'React track not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const removeReactTrack = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackId } = json;
    if (!profileId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // Update the ProfileReactModal collection by pulling (removing) the specified react track entry
        const updatedProfile = await ProfileReactModal.findOneAndUpdate(
            { profileId: profileId },
            {
                // Use $pull to remove the react track entry with the specified trackId
                $pull: {
                    reactTracks: { track: new ObjectId(trackId) },
                },
            },
            // Set the option to return the modified document after the update
            { new: true }
        );
        if (updatedProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed a react track success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const deleteProfileReact = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId } = json;
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const existingReactTrack = await ProfileReactModal.deleteOne({ profileId: new ObjectId(profileId) });

        if (existingReactTrack.deletedCount > 0) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Deleted react profile success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'React profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

module.exports = {
    getReactTrackByProfileId,
    getLikeTrackByProfileId,
    createProfileReact,
    getReactTrackByTrackId,
    addReactTrack,
    updateReactTrack,
    removeReactTrack,
    deleteProfileReact,
};
