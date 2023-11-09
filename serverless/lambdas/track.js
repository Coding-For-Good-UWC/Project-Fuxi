'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { connectDb, closeDb } = require('../lib/mongodb');
const { TrackModel } = require('../models/track');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

const searchTrack = async (event) => {
    await connectDb();
    const { title, pageNumber, pageSize = 15 } = event.queryStringParameters;
    if (!title || !pageNumber) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        const skipCount = (pageNumber - 1) * pageSize;
        const tracks = await TrackModel.find({ Title: { $regex: new RegExp(title, 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by title ${title}`, tracks)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    } finally {
        await closeDb();
    }
};

const getTracksByArtist = async (event) => {
    await connectDb();
    const { artist, pageNumber, pageSize = 15 } = event.queryStringParameters;
    if (!artist || !pageNumber) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const skipCount = (pageNumber - 1) * pageSize;
        const playlist = await TrackModel.find({ Artist: { $regex: new RegExp(artist, 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by artist ${artist}`, playlist)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    } finally {
        await closeDb();
    }
};

const getTrackById = async (event) => {
    await connectDb();
    const { id } = event.queryStringParameters;
    if (!id) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }
    try {
        const track = await TrackModel.findById(id);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get track by id ${id}`, track)) };
    } catch (error) {
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    } finally {
        await closeDb();
    }
};

module.exports = {
    searchTrack,
    getTracksByArtist,
    getTrackById,
};
