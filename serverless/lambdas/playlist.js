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
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const response = await playlistModel.findById(playlistId).populate('tracks');
        if (response) {
            return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', response));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const getAllPlayListByProfileId = async (event) => {
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
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
        return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', result));
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};
const getPlaylistSuggestions = async (event) => {
    const { profileId, pageNumber, pageSize = 50 } = event.queryStringParameters;
    const skipCount = (pageNumber - 1) * pageSize;

    const profile = await profileModel.findById(profileId);

    const getTrackSuggestions = await trackModel
        .find({ Language: { $in: profile.genres } })
        .skip(skipCount)
        .limit(pageSize)
        .exec();
    return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', getTrackSuggestions));
};

const createPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, namePlaylist, tracks } = json;
    if (!profileId || !namePlaylist || !tracks) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const response = await playlistModel.create({
            profileId: new mongoose.Types.ObjectId(profileId),
            namePlaylist,
            tracks: tracks.map((trackId) => new mongoose.Types.ObjectId(trackId)),
        });
        if (response) {
            return JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Created react track success', response));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure'));
        }
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const updatePlaylist = async (event) => {};

const deletePlaylist = async (event) => {
    const { playlistId } = event.queryStringParameters;
    if (!playlistId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const deletePlaylist = await playlistModel.findByIdAndDelete(playlistId);
        if (deletePlaylist) {
            return JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte playlist success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found'));
        }
    } catch (err) {
        console.log(err);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

const deleteAllPlaylist = async (event) => {
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }
    try {
        const deletedPlaylists = await playlistModel.deleteMany({ profileId: profileId });
        if (deletedPlaylists.deletedCount > 0) {
            return JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte playlist success'));
        } else {
            return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found'));
        }
    } catch (err) {
        console.log(err);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error'));
    }
};

module.exports = {
    getPlaylistById,
    getAllPlayListByProfileId,
    getPlaylistSuggestions,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    deleteAllPlaylist,
};
