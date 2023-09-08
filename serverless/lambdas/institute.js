"use strict";

const { connectDb } = require("../lib/mongodb");
const instituteModel = require("../models/institute");
const patientModel = require("../models/patient");

connectDb();

const getPatients = async (event) => {
  try {
    const instituteId = event.header.uid;

    if (!instituteId) {
      return {
        statusCode: 400,
        body: { status: "ERROR", message: "Institute ID is required" },
      };
    }

    const institute = await instituteModel.findOne({ uid: instituteId });

    if (!institute) {
      return {
        statusCode: 400,
        body: { status: "ERROR", message: "Institute not found" },
      };
    }

    const patients = await patientModel.find({ institute: institute._id });

    return {
      statusCode: 200,
      body: {
        patients,
        status: "OK",
        message: "Patients retrieved successfully",
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: { status: "ERROR", message: "Server error" },
    };
  }
};

const signup = async (event) => {
  const { uid, email, name } = event.body;
  if (!uid) {
    return {
      statusCode: 400,
      body: {
        status: "ERROR",
        message: "Missing required fields",
      },
    };
  }

  const newInstitute = await instituteModel.create({ uid, email, name });

  return {
    statusCode: 200,
    body: {
      status: "OK",
      message: "Institute created",
      institute: newInstitute,
    },
  };
};

const verify = async (event) => {
  return {
    statusCode: 200,
    body: { status: "OK", message: "Verified", uid: req.uid },
  };
};

const getInstitute = async (event) => {
  const id = event.headers.token;

  const institute = await instituteModel.findOne({ uid: id });

  if (!institute) {
    return {
      statusCode: 400,
      body: {
        status: "ERROR",
        message: "Institute not found",
      },
    };
  }

  return {
    statusCode: 200,
    body: {
      message: "Get Institute",
      institute,
      status: "OK",
    },
  };
};

const checkNameRepeat = async (event) => {
  const { name } = event.query;
  const institute = await instituteModel.findOne({ name: name });
  if (institute == null) {
    return {
      statusCode: 400,
      body: {
        status: "OK",
        message: "Name is unique",
      },
    };
  } else {
    return {
      statusCode: 400,
      body: {
        status: "ERROR",
        message: "same",
      },
    };
  }
};

module.exports = {
  getPatients,
  signup,
  verify,
  getInstitute,
  checkNameRepeat,
};
