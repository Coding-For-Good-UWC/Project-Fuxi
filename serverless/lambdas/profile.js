'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { connectDb } = require('../lib/mongodb');
const instituteModel = require('../models/institute');
const profileModel = require('../models/profile');

connectDb();

const getAllProfilesByInstituteUId = async (event) => {
  try {
    const json = JSON.parse(event.body);
    const { uid, fullname, age, description } = json;

    if (!uid || !fullname || !age) {
      return JSON.stringify({
        statusCode: 400,
        body: { status: 'ERROR', message: 'Bad request' },
      });
    }

    const institute = await instituteModel.findOne({ uid: uid });

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
    const json = JSON.parse(event.body);
}

const createProfile = async (event) => {
    try{
        const json = JSON.parse(event.body);
        const { instituteUid, fullname, age, description } = json;

        if (!uid || !fullname || !age) {
          return JSON.stringify({
            statusCode: 400,
            body: { status: 'ERROR', message: 'Bad request' },
          });
        }

    }catch(err){
        console.log(err);
    }
}