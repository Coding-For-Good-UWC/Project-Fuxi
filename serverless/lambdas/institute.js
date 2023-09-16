'use strict';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const { connectDb } = require('../lib/mongodb');
const instituteModel = require('../models/institute');
const patientModel = require('../models/patient');

connectDb();

const getPatients = async (event) => {
  try {
    console.log(event.body);
    const { uid } = JSON.parse(event.body);
    console.log(uid);

    if (!uid) {
      return JSON.stringify({
        statusCode: 400,
        body: { status: 'ERROR', message: 'Institute ID is required' },
      });
    }

    const institute = await instituteModel.findOne({ uid: uid });

    if (!institute) {
      return JSON.stringify({
        statusCode: 400,
        body: { status: 'ERROR', message: 'Institute not found' },
      });
    }

    const patients = await patientModel.find({ institute: institute._id });

    return JSON.stringify({
      statusCode: 200,
      body: {
        patients,
        status: 'OK',
        message: 'Patients retrieved successfully',
      },
    });
  } catch (err) {
    return JSON.stringify({
      statusCode: 500,
      body: { status: 'ERROR', message: 'Server error' },
    });
  }
};

const signup = async (event) => {
  const { uid, email, name } = JSON.parse(event.body);
  if (!uid) {
    return JSON.stringify({
      statusCode: 400,
      body: {
        status: 'ERROR',
        message: 'Missing required fields',
      },
    });
  }

  const newInstitute = await instituteModel.create({ uid, email, name });

  return JSON.stringify({
    statusCode: 200,
    body: {
      status: 'OK',
      message: 'Institute created',
      institute: newInstitute,
    },
  });
};

const verify = async (event) => {
  const json = JSON.parse(event.body);
  return JSON.stringify({
    statusCode: 200,
    body: { status: 'OK', message: 'Verified', uid: json.uid },
  });
};

const getInstitute = async (event) => {
  const json = JSON.parse(event.body);
  console.log(json);
  const id = json.token;

  const institute = await instituteModel.findOne({ uid: id });

  if (!institute) {
    return JSON.stringify({
      statusCode: 400,
      body: {
        status: 'ERROR',
        message: 'Institute not found',
      },
    });
  }

  return JSON.stringify({
    statusCode: 200,
    body: {
      message: 'Get Institute',
      institute,
      status: 'OK',
    },
  });
};

const checkNameRepeat = async (event) => {
  console.log(event);
  const { name } = event.queryStringParameters;
  console.log(name);
  const institute = instituteModel.findOne({ name: name });
  console.log(institute);
  if (institute == null) {
    return JSON.stringify({
      statusCode: 200,
      body: JSON.stringify(institute), // Stringify the response body
    });
  } else {
    return JSON.stringify({
      statusCode: 400,
      body: {
        status: 'ERROR',
        message: 'same',
      },
    });
  }
};

module.exports = {
  getPatients,
  signup,
  verify,
  getInstitute,
  checkNameRepeat,
};
