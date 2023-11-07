'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const mongoose = require('mongoose');
const { connectDb } = require('../lib/mongodb');
const trackModel = require('../models/track');
const profileModel = require('../models/profile');
const playlistModel = require('../models/playlist');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const getPlaylistById = async (event) => {
    const { playlistId } = event.queryStringParameters;
    if (!playlistId) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await playlistModel.findById(playlistId).populate('tracks');
        if (response) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', response)) };
        } else {
            return { statusCode: 404, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const getAllPlayListByProfileId = async (event) => {
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await playlistModel
            .find({ profileId: new mongoose.Types.ObjectId(profileId) })
            .populate('tracks')
            .sort({ updatedAt: 'desc' });
        const result = await Promise.all(
            response.map(async (item) => {
                if (item.tracks && item.tracks.length > 0) {
                    const firstFourTracks = item.tracks.slice(0, 4);
                    while (firstFourTracks.length < 4) {
                        firstFourTracks.push({});
                    }
                    return {
                        ...item.toObject(),
                        tracks: firstFourTracks,
                    };
                } else {
                    return item;
                }
            }),
        );
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', result)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};
const getPlaylistSuggestions = async (event) => {
    const { profileId, pageNumber, pageSize = 15 } = event.queryStringParameters;
    const skipCount = (pageNumber - 1) * pageSize;

    const profile = await profileModel.findById(profileId);

    const getTrackSuggestions = await trackModel
        .find({ Language: { $in: profile.genres } })
        .skip(skipCount)
        .limit(pageSize)
        .exec();
    return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', getTrackSuggestions)) };
};

const createPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, namePlaylist, tracks } = json;
    if (!profileId || !namePlaylist || !tracks) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const playlist = await playlistModel.create({
            profileId: new mongoose.Types.ObjectId(profileId),
            namePlaylist,
            tracks: tracks.map((trackId) => new mongoose.Types.ObjectId(trackId)),
        });
        await playlistModel.populate(playlist, 'tracks');
        if (playlist) {
            return { statusCode: 201, body: JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Created playlist success', playlist)) };
        } else {
            return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

// const updatePlaylist = async (event) => {};

const addTrackInPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackId } = json;
    if (!profileId || !trackId) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const addTrack = await playlistModel.findOneAndUpdate(
            { profileId: profileId },
            {
                $push: {
                    tracks: new mongoose.Types.ObjectId(trackId),
                },
            },
        );
        if (addTrack) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added track success')) };
        } else {
            return { statusCode: 404, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const removeTrackInPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackId } = json;
    if (!profileId || !trackId) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const updatedProfile = await playlistModel.findOneAndUpdate(
            { profileId: profileId },
            {
                $pull: {
                    tracks: new mongoose.Types.ObjectId(trackId),
                },
            },
        );
        if (updatedProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed track success')) };
        } else {
            return { statusCode: 404, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const deletePlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { playlistId } = json;
    if (!playlistId) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const deletePlaylist = await playlistModel.findByIdAndDelete(playlistId);
        if (deletePlaylist) {
            return { statusCode: 204, body: JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte playlist success')) };
        } else {
            return { statusCode: 404, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const deleteAllPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId } = json;
    if (!profileId) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const deletedPlaylists = await playlistModel.deleteMany({ profileId: profileId });
        if (deletedPlaylists.deletedCount > 0) {
            return { statusCode: 204, body: JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte playlist success')) };
        } else {
            return { statusCode: 404, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

module.exports = {
    getPlaylistById,
    getAllPlayListByProfileId,
    getPlaylistSuggestions,
    createPlaylist,
    addTrackInPlaylist,
    removeTrackInPlaylist,
    deletePlaylist,
    deleteAllPlaylist,
};
