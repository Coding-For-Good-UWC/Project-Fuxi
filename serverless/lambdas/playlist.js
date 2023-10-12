'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { connectDb } = require('../lib/mongodb');
const instituteModel = require('../models/institute');
const patientModel = require('../models/patient');
const trackModel = require('../models/track');

connectDb();

const getPlaylistByArtist = async (event) => {
  try {
    const { artist } = JSON.parse(event.body);

    if (!artist) {
      return JSON.stringify({
        statusCode: 400,
        status: 'Bad Request',
        message: 'Missing required fields',
      });
    }

    const playlist = await trackModel.find({ Artist: artist }).exec();

    return JSON.stringify({
      statusCode: 200,
      status: 'OK',
      message: `Get playlist by artist ${artist}`,
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

module.exports = { getPlaylistByArtist, getPlaylistByGenresInProfile };
