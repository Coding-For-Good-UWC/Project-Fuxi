'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const trackModel = require('../models/track');
const { connectDb } = require('../lib/mongodb');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');
connectDb();

const searchTrack = async (event) => {
    const { title, pageNumber, pageSize = 15 } = JSON.parse(event.body);
    if (!title || !pageNumber) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }

    try {
        const skipCount = (pageNumber - 1) * pageSize;
        const tracks = await trackModel
            .find({ Title: { $regex: new RegExp(title, 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
        return JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by title ${title}`, tracks));
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error'));
    }
};

const getTracksByArtist = async (event) => {
    try {
        const { artist } = JSON.parse(event.body);
        if (!artist) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }

        const playlist = await trackModel.find({ Artist: artist }).exec();
        return JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get playlist by artist ${artist}`, playlist));
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error'));
    }
};

module.exports = {
    searchTrack,
    getTracksByArtist,
};
