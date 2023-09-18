'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb } = require('../lib/mongodb');
const instituteModel = require('../models/institute');
const profileModel = require('../models/profile');

connectDb();

const getAllProfilesByInstituteUId = async (event) => {
  try {
    const uid = event.queryStringParameters.uid;

    if (!uid) {
      return JSON.stringify({
        statusCode: 400,
        body: { status: 'ERROR', message: 'Bad request' },
      });
    }

    const institute = await instituteModel.find({ uid: uid });

    if (!institute) {
      return JSON.stringify({
        statusCode: 404,
        body: { status: 'ERROR', message: 'Institute not found' },
      });
    }

    const profiles = await profileModel.find({ uid: uid });

    return JSON.stringify({
      statusCode: 200,
      body: { status: 'OK', profiles },
    });
  } catch (err) {
    console.log(err);
  }
};

const getProfileById = async (event) => {
  const id = event.queryStringParameters;

  if (!id) {
    return JSON.stringify({
      statusCode: 400,
      body: { status: 'ERROR', message: 'Bad request' },
    });
  }

  const profile = await profileModel.findOne({ _id: ObjectId(id) });

  if (!profile) {
    return JSON.stringify({
      statusCode: 404,
      body: { status: 'ERROR', message: 'Profile not found' },
    });
  }

  return JSON.stringify({
    statusCode: 200,
    body: { status: 'OK', profile },
  });
};

const createProfile = async (event) => {
  try {
    const json = JSON.parse(event.body);
    const { instituteUid, fullname, age, description } = json;

    if (!instituteUid || !fullname || !age) {
      return JSON.stringify({
        statusCode: 400,
        body: { status: 'ERROR', message: 'Bad request' },
      });
    }

    const profile = await new profileModel({ uid: instituteUid, fullname, age, description });
    profile.save();

    return JSON.stringify({
      statusCode: 201,
      body: { status: 'Created', profile },
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteProfile = async (event) => {
  try {
    const id = event.queryStringParameters.id;

    if (!id) {
      return JSON.stringify({
        statusCode: 400,
        body: { status: 'ERROR', message: 'Bad request' },
      });
    }

    const deleteProfile = await profileModel.findByIdAndDelete(id);

    if (deleteProfile) {
      return JSON.stringify({
        statusCode: 204,
        body: { status: 'No Content' },
      });
    } else {
      return JSON.stringify({
        statusCode: 404,
        body: { status: 'ERROR', message: 'Profile not found' },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateProfile = async (event) => {
  try {
    const json = JSON.parse(event.body);
    const { id, fullname, age, description } = json;

    if (!id || !fullname || !age) {
      return JSON.stringify({
        statusCode: 400,
        body: { status: 'ERROR', message: 'Bad request' },
      });
    }

    const updateProfile = await profileModel.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          fullname,
          age,
          description,
        },
      },
      { new: true },
    );

    if (updateProfile) {
      return {
        statusCode: 200,
        body: { status: 'OK', updateProfile },
      };
    } else {
      return {
        statusCode: 404,
        body: { status: 'ERROR', message: 'Profile not found' },
      };
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getAllProfilesByInstituteUId, getProfileById, createProfile, deleteProfile, updateProfile };
