'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb } = require('../lib/mongodb');

const profileModel = require('../models/profile');
const trackModel = require('../models/track');
const reactTrackModel = require('../models/reactTrack');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');

connectDb();

const createReactTrack = async (event) => {
  const json = JSON.parse(event.body);
  const { profileId, trackId, isReact } = json;

  if (!profileId || !trackId || !isReact) {
    return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
  }

  try {
    const response = await reactTrackModel.create({
      profileId,
      trackId,
      isReact,
    });
    if (response) {
      return JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Created react track success', response));
    } else {
      return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure'));
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Create failure'));
  }
};

const updateReactTrack = async (event) => {
  const json = JSON.parse(event.body);
  const { profileId, trackId, isReact } = json;

  if (!profileId || !trackId || !isReact) {
    return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
  }

  try {
    const existingReactTrack = await reactTrackModel.findOne({ profileId, trackId });

    if (existingReactTrack) {
      existingReactTrack.isReact = isReact;
      const updatedReactTrack = await existingReactTrack.save();

      return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Updated react track success', updatedReactTrack));
    } else {
      const response = await reactTrackModel.create({
        profileId,
        trackId,
        isReact,
      });

      return JSON.stringify(ApiResponse.success(HttpStatus.CREATED, 'Created react track success', response));
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Update or create failure'));
  }
};

const deleteReactTrack = async (event) => {
  const json = JSON.parse(event.body);
  const { profileId, trackId } = json;

  if (!profileId || !trackId) {
    return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
  }

  try {
    const existingReactTrack = await reactTrackModel.findOne({ profileId, trackId });

    if (existingReactTrack) {
      await existingReactTrack.destroy();
      return JSON.stringify(ApiResponse.success(HttpStatus.OK, 'Deleted react track success'));
    } else {
      return JSON.stringify(ApiResponse.error(HttpStatus.NOT_FOUND, 'React track not found'));
    }
  } catch (error) {
    console.error(error);
    return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Delete failure'));
  }
};

module.exports = { createReactTrack, updateReactTrack, deleteReactTrack };
