'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const mongoose = require('mongoose');
const { connectDb, closeDb } = require('../lib/mongodb');
const { TrackModel } = require('../models/track');
const { ProfileModel } = require('../models/profile');
const { PlaylistModel } = require('../models/playlist');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');
const { ProfileReactModal } = require('../models/profileReact');

connectDb();

const getPlaylistById = async (event) => {
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
    }
};

const getAllPlayListByProfileId = async (event) => {
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
            })
        );
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', result)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};
const getPlaylistSuggestions = async (event) => {
    const { profileId, pageNumber = 1, pageSize = 15 } = event.queryStringParameters;
    const skipCount = (pageNumber - 1) * pageSize;

    const profile = await ProfileModel.findById(profileId);

    let getTrackSuggestions = [];

    if (Object.keys(profile.genres).length !== 0) {
        getTrackSuggestions = await TrackModel.find({
            $or: [{ Language: { $in: profile.genres } }, { Genre: { $in: profile.genres } }],
        })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
    } else {
        getTrackSuggestions = await TrackModel.find({ Artist: { $regex: new RegExp('', 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
    }
    return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Get all playlist in profile success', getTrackSuggestions)) };
};

const createPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, namePlaylist, tracks } = json;
    if (!profileId || !namePlaylist || !tracks) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        const existingPlaylist = await PlaylistModel.findOne({ profileId: new mongoose.Types.ObjectId(profileId), namePlaylist });

        if (existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.CONFLICT, 'Playlist already exists')) };
        }

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
    }
};

// const updatePlaylist = async (event) => {};

const addTrackInPlaylist = async (event) => {
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
            }
        );
        if (addTrack) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added track success')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const removeTrackInPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { playlistId, trackId } = json;

    if (!playlistId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        const existingPlaylist = await PlaylistModel.findById(playlistId);

        if (!existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Track not found in the playlist')) };
        }

        const filteredTracks = existingPlaylist.tracks.filter((existingTrackId) => existingTrackId.toString() !== trackId);

        const updatedProfile = await PlaylistModel.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(playlistId) },
            {
                $set: {
                    tracks: filteredTracks,
                },
            },
            { new: true }
        );

        if (updatedProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed track success', updatedProfile)) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update profile')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const deletePlaylist = async (event) => {
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
    }
};

const deleteAllPlaylist = async (event) => {
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
    }
};

const getSuggestionsInPlaymedia = async (event) => {
    const { profileId, artist, language, genre, era } = event.queryStringParameters;

    const filteredIds = [];
    if (profileId !== undefined && profileId !== null && profileId.length <= 0) {
        const response = await ProfileReactModal.find({ profileId: new mongoose.Types.ObjectId(profileId) });
        const filterTrackDislike = response[0].reactTracks.filter((item) => item.preference === 'dislike' || item.preference === 'strongly dislike');
        filteredIds = filterTrackDislike.map((item) => item._id);
    }

    try {
        let listTrackByArtist = [];
        if (artist !== undefined && artist !== null) {
            listTrackByArtist = await TrackModel.aggregate([{ $match: { Artist: artist, _id: { $nin: filteredIds } } }, { $sample: { size: 7 } }]);
        }

        const matchCriteria = {};
        if (language) {
            matchCriteria.Language = language;
        }
        if (genre) {
            matchCriteria.Genre = genre;
        }

        let listTrackByLanguageAndGenre = await TrackModel.aggregate([
            { $match: { _id: { $nin: filteredIds }, ...matchCriteria } },
            { $sample: { size: 7 } },
        ]);

        let listTrackByEra = [];
        if (era !== undefined && era !== null) {
            listTrackByEra = await TrackModel.aggregate([
                { $match: { Era: parseInt(era, 10), _id: { $nin: filteredIds } } },
                { $sample: { size: 7 } },
            ]);
        } else {
            listTrackByEra = await TrackModel.aggregate([
                { $match: { Era: { $exists: false }, _id: { $nin: filteredIds } } },
                { $sample: { size: 7 } },
            ]);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(
                ApiResponse.success(HttpStatus.OK, `OK`, {
                    listTrackByArtist: listTrackByArtist,
                    listTrackByLanguageAndGenre: listTrackByLanguageAndGenre,
                    listTrackByEra: listTrackByEra,
                })
            ),
        };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
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
    getSuggestionsInPlaymedia,
};
