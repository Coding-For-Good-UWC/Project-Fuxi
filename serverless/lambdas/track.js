'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const trackModel = require('../models/track');
const { connectDb } = require('../lib/mongodb');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');
connectDb();

const searchTrack = async (event) => {
    const { title, pageNumber, pageSize = 15 } = event.queryStringParameters;
    if (!title || !pageNumber) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        const skipCount = (pageNumber - 1) * pageSize;
        const tracks = await trackModel
            .find({ Title: { $regex: new RegExp(title, 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by title ${title}`, tracks)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    }
};

const getTracksByArtist = async (event) => {
    const { artist, pageNumber, pageSize = 15 } = event.queryStringParameters;
    if (!artist || !pageNumber) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const skipCount = (pageNumber - 1) * pageSize;
        const playlist = await trackModel
            .find({ Artist: { $regex: new RegExp(artist, 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by artist ${artist}`, playlist)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    }
};

const getTrackById = async (event) => {
    const { id } = event.queryStringParameters;
    if (!id) {
        return { statusCode: 400, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const track = await trackModel.findById(id);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get track by id ${id}`, track)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    }
};

module.exports = {
    searchTrack,
    getTracksByArtist,
    getTrackById,
};
