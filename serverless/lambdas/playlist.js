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
    // verify field
    if (!playlistId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // Find a playlist by its unique identifier (playlistId) in the PlaylistModel, Populate the 'tracks' field of the found playlist with the corresponding documents from the 'tracks' collection
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
    // verify field
    if (!profileId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // Search all playlists by profileId
        const response = await PlaylistModel.find({ profileId: new mongoose.Types.ObjectId(profileId) })
            .populate('tracks')
            .sort({ updatedAt: 'desc' });
        // Find the first 4 songs in the playlist to consider the playlist image
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
    // verify field
    if (!profileId || !namePlaylist || !tracks) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // Check if the playlist name exists or not, if so, return an error and notification
        const existingPlaylist = await PlaylistModel.findOne({ profileId: new mongoose.Types.ObjectId(profileId), namePlaylist });

        if (existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.CONFLICT, 'Playlist with the same name already exists')) };
        }

        // Create playlist
        const playlist = await PlaylistModel.create({
            profileId: new mongoose.Types.ObjectId(profileId),
            namePlaylist,
            tracks: tracks.map((trackId) => new mongoose.Types.ObjectId(trackId)),
        });
        // Populate the 'tracks' field of the created playlist with the corresponding documents from the 'tracks' collection
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

const addTrackInPlaylist = async (event) => {
    await connectDb();
    const json = JSON.parse(event.body);
    const { profileId, playlistId, trackId } = json;
    // verify field
    if (!playlistId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        // search for playlists and add songs to the playlist
        const playlist = await PlaylistModel.findByIdAndUpdate(
            playlistId,
            {
                // Use the $addToSet operator to add a new track to the 'tracks' array in the playlist
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
        // Find the existing playlist by its unique identifier (playlistId)
        const existingPlaylist = await PlaylistModel.findById(playlistId);

        // If the playlist does not exist, return a not found response
        if (!existingPlaylist) {
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Track not found in the playlist')),
            };
        }

        // Filter out the specified trackId from the existing playlist's tracks array
        const filteredTracks = existingPlaylist.tracks.filter((existingTrackId) => existingTrackId.toString() !== trackId);

        // Update the playlist by replacing its tracks with the filtered array
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
        // Find and delete the playlist with the specified unique identifier (playlistId)
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
        // Delete all playlists associated with the specified profileId
        const deletedPlaylists = await PlaylistModel.deleteMany({ profileId: profileId });

        // Check if any playlists were deleted
        if (deletedPlaylists.deletedCount > 0) {
            // Return a success response if playlists were deleted
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.success(HttpStatus.NO_CONTENT, 'Delete playlist success')),
            };
        } else {
            // Return an error response if no playlists were found for the profileId
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile not found')),
            };
        }
    } catch (err) {
        console.log(err);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const getSuggestionsInPlaymedia = async (event) => {
    // Parse the request body to extract relevant parameters
    const json = JSON.parse(event.body);
    const { profileId, playlistId, artist, language, genre, era } = json;

    // Retrieve the user's reactTracks from the ProfileReactModal
    const response = await ProfileReactModal.findOne({ profileId: new mongoose.Types.ObjectId(profileId) });
    const filteredTrackIds = response.reactTracks.map((item) => item.track);

    // Filter out disliked tracks to create a list of track IDs to exclude
    const filterTrackDislike = response.reactTracks.filter((item) => item.preference === 'dislike' || item.preference === 'strongly dislike');
    const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

    // Retrieve existing playlist tracks, if available
    const existingPlaylist = await PlaylistModel.findById(playlistId);
    let existingTrackIdsPlaylist = [];
    if (existingPlaylist) {
        existingTrackIdsPlaylist = existingPlaylist.tracks;
    }

    try {
        // Fetch tracks based on the specified artist
        let listTrackByArtist = [];
        if (artist !== undefined && artist !== null) {
            listTrackByArtist = await TrackModel.aggregate([
                { $match: { Artist: artist, _id: { $nin: filteredTrackIdsDislike } } },
                { $sample: { size: 7 } },
            ]);
        }

        // Retrieve profiles with high scores and their associated unique tracks
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

        // Extract unique tracks from high-scored profiles
        const uniqueTracksSet = new Set();
        highScoredProfiles.forEach(({ reactTracks }) => {
            reactTracks.forEach(({ track }) => {
                uniqueTracksSet.add(track);
            });
        });

        const uniqueTracksArray = Array.from(uniqueTracksSet);

        // Filter out already reacted tracks from unique tracks
        const filteredUniqueTracksArray = uniqueTracksArray.filter((track) => !filteredTrackIds.some((id) => id.toString() === track.toString()));

        // Define criteria for matching language and genre
        const matchCriteria = {};
        if (language) {
            matchCriteria.Language = language;
        }
        if (genre) {
            matchCriteria.Genre = genre;
        }

        // Fetch highly liked tracks that are not disliked or in the existing playlist
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

        // Fetch tracks based on language and genre
        let listTrackByLanguageAndGenre = await TrackModel.aggregate([
            { $match: { _id: { $nin: [...filteredTrackIdsDislike, ...existingTrackIdsPlaylist] }, ...matchCriteria } },
            { $sample: { size: 7 } },
        ]);

        // Fetch tracks based on the specified era
        let listTrackByEra = [];
        if (era !== undefined && era !== null) {
            listTrackByEra = await TrackModel.aggregate([
                { $match: { Era: parseInt(era, 10), _id: { $nin: [...filteredTrackIdsDislike, ...existingTrackIdsPlaylist] } } },
                { $sample: { size: 7 } },
            ]);
        }

        // Return a successful response with the fetched track lists
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
    // Parse the request body to extract relevant parameters
    const json = JSON.parse(event.body);
    const { profileId, playlistId, currentTrackId, preference } = json;

    try {
        // verify field
        const existingPlaylist = await PlaylistModel.findById(playlistId);

        if (!existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }

        // Check if the profile's react information exists
        const existingReactProfile = await ProfileReactModal.findOne({ profileId: profileId });

        if (!existingReactProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile react not found')) };
        }

        if (preference === 'like' || preference === 'strongly like') {
            // Filter out disliked tracks from the profile's reactTracks
            const filterTrackDislike = existingReactProfile.reactTracks.filter(
                (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
            );
            const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

            // Merge filtered disliked tracks and existing playlist tracks
            const mergeFilter = [...filteredTrackIdsDislike, ...existingPlaylist.tracks];

            // Retrieve information about the current track
            const currentTrack = await TrackModel.findById(currentTrackId);

            // Find a random track based on language, genre, and era
            const randomSongs = await TrackModel.aggregate([
                {
                    $match: {
                        $or: [{ Language: currentTrack.Language }, { Genre: currentTrack.Genre }, { Era: currentTrack.Era }],
                        _id: { $nin: mergeFilter },
                    },
                },
                { $sample: { size: 1 } },
            ]);

            // Find the index of the current track in the playlist
            let indexCurrentTrackId = existingPlaylist.tracks.indexOf(new mongoose.Types.ObjectId(currentTrackId));

            // If the current track is not in the playlist, add it to the end
            if (indexCurrentTrackId === -1) {
                indexCurrentTrackId = existingPlaylist.tracks.length - 1;
            }

            // Insert the randomly selected track after the current track in the playlist
            existingPlaylist.tracks.splice(indexCurrentTrackId + 1, 0, randomSongs[0]?._id);

            // Update the playlist with the modified tracks
            await PlaylistModel.findByIdAndUpdate(playlistId, { tracks: existingPlaylist.tracks });

            // Return a success response with the added track information
            return {
                statusCode: 200,
                body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Added tracks to playlist successfully', randomSongs[0])),
            };
        }
    } catch (error) {
        // Log any errors and return a server error response
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const addSuggetionTrackWhenDislikeInPlaylist = async (event) => {
    // Parse the request body to extract relevant parameters
    const json = JSON.parse(event.body);
    const { profileId, playlistId } = json;

    // Check if required fields are present
    if (!profileId || !playlistId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // verify field
        const existingPlaylist = await PlaylistModel.findById(playlistId);

        if (!existingPlaylist) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Playlist not found')) };
        }

        // Check if the playlist has a small number of tracks (less than or equal to 5)
        if (existingPlaylist.tracks.length <= 5) {
            // Retrieve the user's react information
            const existingReactProfile = await ProfileReactModal.findOne({ profileId: profileId });

            if (!existingReactProfile) {
                return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile react not found')) };
            }

            // Filter out disliked tracks from the user's reactTracks
            const filterTrackDislike = existingReactProfile.reactTracks.filter(
                (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
            );
            const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);
            const mergeFilter = [...filteredTrackIdsDislike, ...existingPlaylist.tracks];

            // Retrieve the user's profile information
            const profile = await ProfileModel.findById(profileId);

            // Find random tracks based on the user's profile genres
            const randomSongs = await TrackModel.aggregate([
                {
                    $match: {
                        $or: [{ Language: { $in: profile.genres } }, { Genre: { $in: profile.genres } }],
                        _id: { $nin: mergeFilter },
                    },
                },
                { $sample: { size: 10 } },
            ]);

            // Extract track IDs from the random songs
            const arrayTrackIds = randomSongs.map((song) => song._id);

            // Merge the existing playlist tracks with the new suggested track IDs
            const mergedArrayObjectId = existingPlaylist.tracks.concat(arrayTrackIds.filter((id) => !existingPlaylist.tracks.includes(id)));

            // Update the playlist with the modified tracks
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

    // Check if required fields are present
    if (!profileId || !trackId) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // Retrieve the user's react information
        const existingReactProfile = await ProfileReactModal.findOne({ profileId: profileId });

        if (!existingReactProfile) {
            return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'Profile react not found')) };
        }

        // Filter out disliked tracks from the user's reactTracks
        const filterTrackDislike = existingReactProfile.reactTracks.filter(
            (item) => item.preference === 'dislike' || item.preference === 'strongly dislike'
        );
        const filteredTrackIdsDislike = filterTrackDislike.map((item) => item._id);

        // Convert trackIds to an array of ObjectId
        const objectTrackIdsArray = trackIds.map((trackId) => new mongoose.Types.ObjectId(trackId));

        // Merge filtered disliked tracks and provided trackIds
        const mergedArray = [...new Set([...filteredTrackIdsDislike, ...objectTrackIdsArray])];

        // Retrieve information about the current track
        const currentTrack = await TrackModel.findById(trackId);

        // Find a random track based on language, genre, and era
        const randomTrack = await TrackModel.aggregate([
            {
                $match: {
                    $or: [{ Language: currentTrack.Language }, { Genre: currentTrack.Genre }, { Era: currentTrack.Era }],
                    _id: { $nin: mergedArray },
                },
            },
            { $sample: { size: 1 } },
        ]);

        // Return a success response with the randomly selected track
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Random next track', randomTrack[0])) };
    } catch (error) {
        // Log any errors and return a server error response
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error')) };
    }
};

const createOrUpdateInitialPlaylistWhenChangeProfile = async (profileId, genres) => {
    // Set the maximum number of tracks for the playlist
    const maxTracks = 30;

    // Calculate the maximum number of tracks per genre
    const maxTracksPerGenre = Math.floor(maxTracks / genres.length);

    // Initialize an array to store the selected tracks
    let selectedTracks = [];

    // Iterate through each genre
    for (const genre of genres) {
        // Retrieve tracks for the current genre
        let genreTracks = await TrackModel.find({
            $or: [{ Language: genre }, { Genre: genre }],
        });

        let tracksFromGenre = 0;

        // Select tracks from the current genre until reaching the maximum for that genre
        while (selectedTracks.length < maxTracks && genreTracks.length > 0 && tracksFromGenre < maxTracksPerGenre) {
            const randomIndex = Math.floor(Math.random() * genreTracks.length);
            selectedTracks.push(genreTracks[randomIndex]);
            genreTracks.splice(randomIndex, 1);

            tracksFromGenre++;
        }
    }

    // Select additional tracks from random genres until reaching the overall maximum
    while (selectedTracks.length < maxTracks) {
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        const genreTracks = await TrackModel.find({
            $or: [{ Language: randomGenre }, { Genre: randomGenre }],
        });

        // If there are tracks in the random genre, select a random track
        if (genreTracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * genreTracks.length);
            selectedTracks.push(genreTracks[randomIndex]);
        }
    }

    // Extract track IDs from the selected tracks
    const arrayTrackIds = selectedTracks.map((song) => song._id);

    // Check if a playlist with the specified name already exists for the user
    const existingPlaylist = await PlaylistModel.findOne({ profileId: profileId, namePlaylist: 'Suggestion for you' });

    // If the playlist exists, update its tracks; otherwise, create a new playlist
    if (existingPlaylist) {
        await PlaylistModel.findOneAndUpdate({ profileId: profileId }, { $set: { tracks: arrayTrackIds } });
    } else {
        await PlaylistModel.create({
            profileId: new mongoose.Types.ObjectId(profileId),
            namePlaylist: 'Suggestion for you',
            tracks: arrayTrackIds,
        });
    }
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
    createOrUpdateInitialPlaylistWhenChangeProfile,
};
