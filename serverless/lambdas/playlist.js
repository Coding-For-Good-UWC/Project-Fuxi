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
    await connectDb();
    const json = JSON.parse(event.body);
    const { playlistId, trackId } = json;
    if (!playlistId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const existingPlaylist = await PlaylistModel.findById(playlistId);

        if (!existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }

        if (existingPlaylist.tracks.length >= 30 && existingPlaylist.namePlaylist === 'Suggestion for you') {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Playlist suggests up to 30 songs for you')) };
        }

        const playlist = await PlaylistModel.findByIdAndUpdate(
            playlistId,
            {
                $addToSet: {
                    tracks: new mongoose.Types.ObjectId(trackId),
                },
            },
            { new: true }
        );

        if (playlist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Track added to the playlist successfully')) };
        } else {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
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
            }
        );

        if (updatedProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed track success')) };
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
    const json = JSON.parse(event.body);
    const { profileId, playlistId, artist, language, genre, era } = json;

    const response = await ProfileReactModal.findOne({ profileId: new mongoose.Types.ObjectId(profileId) });
    const filteredTrackIds = response.reactTracks.map((item) => item.track);

    const filterTrackDislike = response.reactTracks.filter((item) => item.preference === 'dislike' || item.preference === 'strongly dislike');
    const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

    const existingPlaylist = await PlaylistModel.findById(playlistId);
    let existingTrackIdsPlaylist = [];
    if (existingPlaylist) {
        existingTrackIdsPlaylist = existingPlaylist.tracks;
    }

    try {
        let listTrackByArtist = [];
        if (artist !== undefined && artist !== null) {
            listTrackByArtist = await TrackModel.aggregate([
                { $match: { Artist: artist, _id: { $nin: filteredTrackIdsDislike } } },
                { $sample: { size: 7 } },
            ]);
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

        const matchCriteria = {};
        if (language) {
            matchCriteria.Language = language;
        }
        if (genre) {
            matchCriteria.Genre = genre;
        }

        let listTrackHighLike = await TrackModel.aggregate([
            {
                $match: {
                    _id: {
                        $in: filteredUniqueTracksArray,
                        $nin: [...filteredTrackIdsDislike, ...existingTrackIdsPlaylist],
                    },
                    ...matchCriteria,
                },
            },
            { $sample: { size: 7 } },
        ]);

        let listTrackByLanguageAndGenre = await TrackModel.aggregate([
            { $match: { _id: { $nin: [...filteredTrackIdsDislike, ...existingTrackIdsPlaylist] }, ...matchCriteria } },
            { $sample: { size: 7 } },
        ]);

        let listTrackByEra = [];
        if (era !== undefined && era !== null) {
            listTrackByEra = await TrackModel.aggregate([
                { $match: { Era: parseInt(era, 10), _id: { $nin: [...filteredTrackIdsDislike, ...existingTrackIdsPlaylist] } } },
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

const addSuggetionTrackWhenLikeInPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, playlistId, currentTrackId, preference } = json;

    try {
        const existingPlaylist = await PlaylistModel.findById(playlistId);

        if (!existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }

        if (existingPlaylist.tracks.length >= 30 && existingPlaylist.namePlaylist === 'Suggestion for you') {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Playlist suggests up to 30 songs for you')) };
        }

        const existingReactProfile = await ProfileReactModal.findOne({ profileId: profileId });

        if (!existingReactProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile react not found')) };
        }

        if (preference === 'like' || preference === 'strongly like') {
            const filterTrackDislike = existingReactProfile.reactTracks.filter(
                (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
            );
            const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

            const mergeFilter = [...filteredTrackIdsDislike, ...existingPlaylist.tracks];

            const currentTrack = await TrackModel.findById(currentTrackId);
            const randomSongs = await TrackModel.aggregate([
                {
                    $match: {
                        $or: [{ Language: currentTrack.Language }, { Genre: currentTrack.Genre }, { Era: currentTrack.Era }],
                        _id: { $nin: mergeFilter },
                    },
                },
                { $sample: { size: 1 } },
            ]);

            let indexCurrentTrackId = existingPlaylist.tracks.indexOf(new mongoose.Types.ObjectId(currentTrackId));

            if (indexCurrentTrackId === -1) {
                indexCurrentTrackId = existingPlaylist.tracks.length - 1;
            }

            existingPlaylist.tracks.splice(indexCurrentTrackId + 1, 0, randomSongs[0]?._id);

            await PlaylistModel.findByIdAndUpdate(playlistId, { tracks: existingPlaylist.tracks });

            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added tracks to playlist successfully', randomSongs[0])),
            };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const addSuggetionTrackWhenDislikeInPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, playlistId } = json;
    if (!profileId || !playlistId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const existingPlaylist = await PlaylistModel.findById(playlistId);

        if (!existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }

        if (existingPlaylist.tracks.length <= 5) {
            const existingReactProfile = await ProfileReactModal.findOne({ profileId: profileId });

            if (!existingReactProfile) {
                return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile react not found')) };
            }

            const filterTrackDislike = existingReactProfile.reactTracks.filter(
                (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
            );
            const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);
            const mergeFilter = [...filteredTrackIdsDislike, ...existingPlaylist.tracks];

            const profile = await ProfileModel.findById(profileId);

            const randomSongs = await TrackModel.aggregate([
                {
                    $match: {
                        $or: [{ Language: { $in: profile.genres } }, { Genre: { $in: profile.genres } }],
                        _id: { $nin: mergeFilter },
                    },
                },
                { $sample: { size: 10 } },
            ]);

            const arrayTrackIds = randomSongs.map((song) => song._id);
            const mergedArrayObjectId = existingPlaylist.tracks.concat(arrayTrackIds.filter((id) => !existingPlaylist.tracks.includes(id)));

            await PlaylistModel.findByIdAndUpdate(playlistId, { tracks: mergedArrayObjectId });
            return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Removed track success')) };
        }
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const randomNextTrack = async (event) => {
    const json = JSON.parse(event.body);
    const { profileId, trackIds, trackId } = json;
    if (!profileId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const existingReactProfile = await ProfileReactModal.findOne({ profileId: profileId });

        if (!existingReactProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile react not found')) };
        }

        const filterTrackDislike = existingReactProfile.reactTracks.filter(
            (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
        );
        const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

        const objectTrackIdsArray = trackIds.map((trackId) => new mongoose.Types.ObjectId(trackId));

        const mergedArray = [...new Set([...filteredTrackIdsDislike, ...objectTrackIdsArray])];

        const currentTrack = await TrackModel.findById(trackId);
        const randomTrack = await TrackModel.aggregate([
            {
                $match: {
                    $or: [{ Language: currentTrack.Language }, { Genre: currentTrack.Genre }, { Era: currentTrack.Era }],
                    _id: { $nin: mergedArray },
                },
            },
            { $sample: { size: 1 } },
        ]);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Random next track', randomTrack[0])) };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const createPlaylistWhenCreateProfile = async (profileId, genres) => {
    const maxTracks = 30;
    const tracksPerGenre = Math.ceil(maxTracks / genres.length);

    let selectedTracks = [];

    for (const genre of genres) {
        const genreTracks = await TrackModel.find({
            $or: [{ Language: genre }, { Genre: genre }],
        });

        for (let i = 0; i < Math.min(tracksPerGenre, genreTracks.length); i++) {
            const randomIndex = Math.floor(Math.random() * genreTracks.length);
            selectedTracks.push(genreTracks[randomIndex]);
            genreTracks.splice(randomIndex, 1);
        }
    }

    const arrayTrackIds = selectedTracks.map((song) => song._id);

    const playlist = await PlaylistModel.create({
        profileId: new mongoose.Types.ObjectId(profileId),
        namePlaylist: 'Suggestion for you',
        tracks: arrayTrackIds,
    });

    await PlaylistModel.populate(playlist, 'tracks');
};

module.exports = {
    getPlaylistById,
    getAllPlayListByProfileId,
    createPlaylist,
    addTrackInPlaylist,
    removeTrackInPlaylist,
    deletePlaylist,
    deleteAllPlaylist,
    getSuggestionsInPlaymedia,
    addSuggetionTrackWhenLikeInPlaylist,
    addSuggetionTrackWhenDislikeInPlaylist,
    randomNextTrack,
    createPlaylistWhenCreateProfile,
};
