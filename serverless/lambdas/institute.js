"use strict";

const { connectDb } = require("../lib/mongodb");
const instituteModel = require("../models/institute");

connectDb();

const getInstitute = async (event) => {
  const id = event.headers.token;

  const institute = await instituteModel.findOne({ uid: id });

  return {
    statusCode: 200,
    body: {
      message: "Get Institute",
      input: event,
      institute,
    },
  };
};

module.exports = {
  getInstitute,
};
