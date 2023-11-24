'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb, closeDb } = require('../lib/mongodb');
const { TrackModel } = require('../models/track');
const { ProfileReactModal } = require('../models/profileReact');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');
const { getScoreByPreference } = require('../utils/index');
const { ProfileModel } = require('../models/profile');
const { PlaylistModel } = require('../models/playlist');

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
        // const response = await ProfileReactModal
        //     .find({
        //         profileId: profileId,
        //         'reactTracks.preference': { $in: ['like', 'strongly like'] }, // Not working
        //     })
        //     .populate('reactTracks.track');
        const response = await ProfileReactModal.find({ profileId: new ObjectId(profileId) }).populate('reactTracks.track');
        if (response) {
            return {
                statusCode: 200,
                body: JSON.stringify(
                    ApiResponse.success(
                        HttpStatus.OK,
                        'Data retrieved successfully.',
                        response[0].reactTracks.filter((item) => item.preference === 'like' || item.preference === 'strongly like')
                    )
                ),
            };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile with this ID was not found.')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const createProfileReact = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, reactTracks } = json;
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await ProfileReactModal.create({ profileId, reactTracks });
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
    const json = JSON.parse(event.body);
    const { profileId, playlistId, trackId, preference } = json;
    if (!profileId || !playlistId || !trackId || !preference) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const updatedReactTrack = await ProfileReactModal.findOneAndUpdate(
            { profileId: profileId },
            {
                $push: {
                    reactTracks: {
                        track: new ObjectId(trackId),
                        preference: preference,
                        score: getScoreByPreference(preference),
                    },
                },
            },
            { new: true }
        );

        const filterTrackDislike = updatedReactTrack.reactTracks.filter(
            (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
        );
        const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

        if (preference === 'like' || preference === 'strongly like') {
            const profile = await ProfileModel.findById(profileId);

            const randomSongs = await TrackModel.aggregate([
                {
                    $match: {
                        $or: [{ Language: { $in: profile.genres } }, { Genre: { $in: profile.genres } }],
                        _id: { $nin: filteredTrackIdsDislike },
                    },
                },
                { $sample: { size: 10 } },
            ]);

            const response = await PlaylistModel.findById(playlistId);

            const trackIdsPlaylist = response.tracks;

            const arrayTrackIds = randomSongs.map((song) => song._id);

            const mergedArray = trackIdsPlaylist.concat(arrayTrackIds.filter((id) => !trackIdsPlaylist.includes(id)));

            const addPlaylist = await PlaylistModel.findByIdAndUpdate(playlistId, { tracks: mergedArray }, { new: true }).populate('tracks');
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added tracks to playlist successfully', addPlaylist?.tracks)),
            };
        }

        if (updatedReactTrack) {
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added a new react track success')),
            };
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
        const updatedReactTrack = await ProfileReactModal.findOneAndUpdate(
            {
                profileId: profileId,
                'reactTracks.track': new ObjectId(trackId),
            },
            {
                $set: {
                    'reactTracks.$.preference': preference,
                    'reactTracks.$.score': getScoreByPreference(preference),
                },
            }
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
        const updatedProfile = await ProfileReactModal.findOneAndUpdate(
            { profileId: profileId },
            {
                $pull: {
                    reactTracks: { track: new ObjectId(trackId) },
                },
            }
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
