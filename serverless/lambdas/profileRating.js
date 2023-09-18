'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const profileModel = require('../models/profile');
const trackModel = require('../models/track');
const profileRatingModel = require('../models/profileRating');
const { connectDb } = require('../lib/mongodb');
const profileRating = require('../models/profileRating');

connectDb();

const getRateTrack = async (event) => {
  const json = JSON.parse(event.body);
  const { profileId, trackId } = json;

  if (!trackId || !profileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad Request',
      }),
    };
  }

  const track = await profileRatingModel.find({ profileId, trackId }).exec();

  if (!track) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found',
      }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify(track),
    };
  }
};

const createRateTrack = async (event) => {
  const json = JSON.parse(event.body);
  const { profileId, trackId, rating } = json;

  if (!profileId || !trackId || !rating) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad Request',
      }),
    };
  }

  const profile = await profileModel.findById({ _id: new ObjectId(profileId) });
  const track = await trackModel.findById({ _id: new ObjectId(trackId) });

  if (!profile || !track) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found',
      }),
    };
  }

  const existProfileRate = await profileRatingModel.find({ profileId, trackId }).exec();

  if (existProfileRate) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad Request',
      }),
    };
  }

  const rate = await new profileRatingModel({ profileId, trackId, rating });
  rate.save();

  if (!rate) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  } else {
    return {
      statusCode: 201,
      body: JSON.stringify(rate),
    };
  }
};

const deleteRateTrack = async (event) => {
  const json = JSON.parse(event.body);
  const { profileId, trackId } = json;

  if (!trackId || !profileId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad Request',
      }),
    };
  }

  const deleteRateTrack = await profileRating.findOneAndDelete({ profileId, trackId });

  if (!deleteRateTrack) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found',
      }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify(deleteRateTrack),
    };
  }
};

const updateRateTrack = async (event) => {
  const json = JSON.parse(event.body);
  const { profileId, trackId, rating } = json;

  if (!profileId || !trackId || !rating) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bad Request',
      }),
    };
  }

  const profile = await profileModel.findById({ _id: new ObjectId(profileId) });
  const track = await trackModel.findById({ _id: new ObjectId(trackId) });

  if (!profile || !track) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found',
      }),
    };
  }

  const updateRateTrack = await profileRating.findOneAndUpdate({ profileId, trackId }, { rating }, { new: true });

  if (!updateRateTrack) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found',
      }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify(updateRateTrack),
    };
  }
};

module.exports = { getRateTrack, createRateTrack, deleteRateTrack, updateRateTrack };
