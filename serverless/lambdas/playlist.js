'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const mongoose = require('mongoose');
const { connectDb, closeDb } = require('../lib/mongodb');
const { TrackModel } = require('../models/track');
const { ProfileModel } = require('../models/profile');
const { PlaylistModel } = require('../models/playlist');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

const getPlaylistById = async (event) => {
    await connectDb();
    const { playlistId } = event.queryStringParameters;
    if (!playlistId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await PlaylistModel.findById(playlistId).populate('tracks');
        if (response) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', response)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    } finally {
        await closeDb();
    }
};

const getAllPlayListByProfileId = async (event) => {
    await connectDb();
    const { profileId } = event.queryStringParameters;
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const response = await PlaylistModel.find({ profileId: new mongoose.Types.ObjectId(profileId) })
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
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    } finally {
        await closeDb();
    }
};
const getPlaylistSuggestions = async (event) => {
    await connectDb();
    const { profileId, pageNumber, pageSize = 15 } = event.queryStringParameters;
    const skipCount = (pageNumber - 1) * pageSize;

    const profile = await ProfileModel.findById(profileId);

    const getTrackSuggestions = await TrackModel.find({ Language: { $in: profile.genres } })
        .skip(skipCount)
        .limit(pageSize)
        .exec();
    await closeDb();
    return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', getTrackSuggestions)) };
};

const createPlaylist = async (event) => {
    await connectDb();
    const json = JSON.parse(event.body);
    const { profileId, namePlaylist, tracks } = json;
    if (!profileId || !namePlaylist || !tracks) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const playlist = await PlaylistModel.create({
            profileId: new mongoose.Types.ObjectId(profileId),
            namePlaylist,
            tracks: tracks.map((trackId) => new mongoose.Types.ObjectId(trackId)),
        });
        await PlaylistModel.populate(playlist, 'tracks');
        if (playlist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Created playlist success', playlist)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    } finally {
        await closeDb();
    }
};

// const updatePlaylist = async (event) => {};

const addTrackInPlaylist = async (event) => {
    await connectDb();
    const json = JSON.parse(event.body);
    const { profileId, trackId } = json;
    if (!profileId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const addTrack = await PlaylistModel.findOneAndUpdate(
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
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    } finally {
        await closeDb();
    }
};

const removeTrackInPlaylist = async (event) => {
    await connectDb();
    const json = JSON.parse(event.body);
    const { profileId, trackId } = json;
    if (!profileId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const updatedProfile = await PlaylistModel.findOneAndUpdate(
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
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    } finally {
        await closeDb();
    }
};

const deletePlaylist = async (event) => {
    await connectDb();
    const json = JSON.parse(event.body);
    const { playlistId } = json;
    if (!playlistId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const deletePlaylist = await PlaylistModel.findByIdAndDelete(playlistId);
        if (deletePlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte playlist success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    } finally {
        await closeDb();
    }
};

const deleteAllPlaylist = async (event) => {
    await connectDb();
    const json = JSON.parse(event.body);
    const { profileId } = json;
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const deletedPlaylists = await PlaylistModel.deleteMany({ profileId: profileId });
        if (deletedPlaylists.deletedCount > 0) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delte playlist success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    } finally {
        await closeDb();
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
