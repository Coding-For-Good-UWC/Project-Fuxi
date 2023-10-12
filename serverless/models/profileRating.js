const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
  {
    profileId: {
      type: Types.ObjectId,
      ref: 'profiles',
      required: true,
    },
    trackId: {
      type: Types.ObjectId,
      ref: 'tracks',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { versionKey: false },
);

module.exports = model('profilerating', schema);
