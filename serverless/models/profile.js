const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema({
  uid: {
    type: String,
    unique: true,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  age: {
    type: number,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = model('profiles', schema);
