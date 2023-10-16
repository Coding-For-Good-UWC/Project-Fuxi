'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const mongoose = require('mongoose');
const { connectDb } = require('../lib/mongodb');
const trackModel = require('../models/track');
const playlistModel = require('../models/playlist');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const getPlaylistByGenresInProfile = async (event) => {
    try {
        const { uid } = JSON.parse(event.body);

        if (!uid) {
            return JSON.stringify({
                statusCode: 400,
                status: 'Bad Request',
                message: 'Missing required fields',
            });
        }

        const genreValues = ['English', 'Tamil'];
        // const playlist = await trackModel.find({ Language: { $in: genreValues } }).exec();

        const pipeline = [
            {
                $match: { Language: { $in: genreValues } },
            },
            {
                $group: {
                    _id: '$Artist',
                    tracks: { $push: '$$ROOT' }, // Tạo mảng bản ghi cho từng nghệ sĩ
                },
            },
            {
                $project: {
                    _id: 1,
                    tracks: {
                        $slice: ['$tracks', 0, 4], // Giới hạn số lượng bản ghi theo nghệ sĩ là 4
                    },
                },
            },
            {
                $limit: 5, // Giới hạn số lượng nghệ sĩ là 10
            },
        ];

        const playlist = await trackModel.aggregate(pipeline);
        console.log(playlist);

        return JSON.stringify({
            statusCode: 200,
            status: 'OK',
            message: `Get playlist by artist ${uid}`,
            data: playlist,
        });
    } catch (error) {
        console.error(error);
        return JSON.stringify({
            statusCode: 500,
            status: 'Internal server error',
            message: 'Server Error',
        });
    }
};

const createPlaylist = async (event) => {
    const json = JSON.parse(event.body);
    console.log(json);
    const { profileId, namePlaylist, tracks } = json;
    try {
        if (!profileId || !namePlaylist || !tracks) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }
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
    }
};

module.exports = { getPlaylistByGenresInProfile, createPlaylist };
