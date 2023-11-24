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
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.CONFLICT, 'Playlist with the same name already exists')) };
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
    try {
        const json = JSON.parse(event.body);
        const { profileId, playlistId, trackId } = json;

        if (!profileId || !playlistId || !trackId) {
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields: playlistId, trackId')),
            };
        }

        const existingPlaylist = await PlaylistModel.findById(playlistId);

        if (!existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }

        const filterTrackDislike = existingPlaylist.reactTracks.filter(
            (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
        );
        const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

        const filteredTracks = existingPlaylist.tracks.filter((existingTrackId) => existingTrackId.toString() !== trackId);

        const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(playlistId, { $set: { tracks: filteredTracks } }, { new: true });

        if (updatedPlaylist) {
            if (filteredTracks.length <= 5) {
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

                const arrayTrackIds = randomSongs.map((song) => song._id);
                const mergedArray = filteredTracks.concat(arrayTrackIds.filter((id) => !filteredTracks.includes(id)));
                const addPlaylist = await PlaylistModel.findByIdAndUpdate(playlistId, { tracks: mergedArray }, { new: true }).populate('tracks');
                return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed track success', addPlaylist?.tracks)) };
            } else {
                return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed track success', updatedPlaylist)) };
            }
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update playlist')) };
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

    let filteredTrackIds = [];
    let filteredTrackIdsDislike = [];
    if (profileId !== undefined && profileId !== null && profileId.length >= 0) {
        const response = await ProfileReactModal.findOne({ profileId: new mongoose.Types.ObjectId(profileId) });
        filteredTrackIds = response.reactTracks.map((item) => item.track);

        const filterTrackDislike = response.reactTracks.filter((item) => item.preference === 'dislike' || item.preference === 'strongly dislike');
        filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);
    }

    try {
        let listTrackByArtist = [];
        if (artist !== undefined && artist !== null) {
            listTrackByArtist = await TrackModel.aggregate([
                { $match: { Artist: artist, _id: { $nin: filteredTrackIdsDislike } } },
                { $sample: { size: 7 } },
            ]);
        }

        const matchCriteria = {};
        if (language) {
            matchCriteria.Language = language;
        }
        if (genre) {
            matchCriteria.Genre = genre;
        }

        const highScoredProfiles = await ProfileReactModal.find(
            {
                reactTracks: {
                    $elemMatch: {
                        score: { $in: [4, 5] },
                    },
                },
            },
            { 'reactTracks.track': 1, _id: 0 }
        );

        const uniqueTracksSet = new Set();

        highScoredProfiles.forEach(({ reactTracks }) => {
            reactTracks.forEach(({ track }) => {
                uniqueTracksSet.add(track);
            });
        });

        const uniqueTracksArray = Array.from(uniqueTracksSet);

        const filteredUniqueTracksArray = uniqueTracksArray.filter((track) => !filteredTrackIds.some((id) => id.toString() === track.toString()));

        let listTrackHighLike = await TrackModel.aggregate([
            { $match: { _id: { $in: filteredUniqueTracksArray }, ...matchCriteria } },
            { $sample: { size: 7 } },
        ]);

        let listTrackByLanguageAndGenre = await TrackModel.aggregate([
            { $match: { _id: { $nin: filteredTrackIds }, ...matchCriteria } },
            { $sample: { size: 7 } },
        ]);

        let listTrackByEra = [];
        if (era !== undefined && era !== null) {
            listTrackByEra = await TrackModel.aggregate([
                { $match: { Era: parseInt(era, 10), _id: { $nin: filteredTrackIds } } },
                { $sample: { size: 7 } },
            ]);
        } else {
            listTrackByEra = await TrackModel.aggregate([
                { $match: { Era: { $exists: false }, _id: { $nin: filteredTrackIds } } },
                { $sample: { size: 7 } },
            ]);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(
                ApiResponse.success(HttpStatus.OK, `OK`, {
                    listTrackByArtist: listTrackByArtist,
                    listTrackHighLike: listTrackHighLike,
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
