'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { connectDb, closeDb } = require('../lib/mongodb');
const { TrackModel } = require('../models/track');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const searchTrack = async (event) => {
    // Parse the request body to extract relevant parameters
    const json = JSON.parse(event.body);
    const { title, pageNumber = 1, pageSize = 15, musicTaste = [] } = json;

    try {
        // Calculate the number of documents to skip based on pagination parameters
        const skipCount = (pageNumber - 1) * pageSize;

        // Initialize an empty query object
        let query = {};

        // Add a regex query for the track title if provided
        if (title) {
            query.Title = { $regex: new RegExp(title, 'i') };
        }

        // Add an OR condition for language or genre based on musicTaste
        if (musicTaste && musicTaste.length > 0) {
            query.$or = [{ Language: musicTaste }, { Genre: musicTaste }];
        }

        // Perform the search query on the TrackModel collection
        const tracks = await TrackModel.find(query).skip(skipCount).limit(pageSize).exec();

        // Return a success response with the matching tracks
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by title ${title}`, tracks)) };
    } catch (error) {
        // Log any errors and return a server error response
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    }
};

const getTracksByArtist = async (event) => {
    const { artist, pageNumber = 1, pageSize = 15 } = event.queryStringParameters;

    // Check if required parameters are present
    if (!artist || !pageNumber) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // Calculate the number of records to skip for pagination
        const skipCount = (pageNumber - 1) * pageSize;

        // Query the TrackModel collection to find tracks by artist (case-insensitive)
        const playlist = await TrackModel.find({ Artist: { $regex: new RegExp(artist, 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();

        // Return a success response with the matching tracks
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by artist ${artist}`, playlist)) };
    } catch (error) {
        // Log and return an error response in case of internal server error
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    }
};

const getTrackById = async (event) => {
    const { id } = event.queryStringParameters;

    // Check if the required id parameter is present
    if (!id) {
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields')) };
    }

    try {
        // Query the TrackModel collection to find a track by its unique identifier
        const track = await TrackModel.findById(id);

        // Return a success response with the retrieved track
        return { statusCode: 200, body: JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get track by id ${id}`, track)) };
    } catch (error) {
        // Log and return an error response in case of internal server error
        console.error(error);
        return { statusCode: 200, body: JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error')) };
    }
};

module.exports = {
    searchTrack,
    getTracksByArtist,
    getTrackById,
};
