const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
  {
    profileId: {
      type: Types.ObjectId,
      ref: 'profiles',
      required: [true, 'Profile ID is required'],
    },
    trackId: {
      type: Types.ObjectId,
      ref: 'tracks',
      required: [true, 'Track ID is required'],
    },
    isReact: {
      type: Boolean,
      required: [true, 'React is required'],
    },
  },
  { versionKey: false },
);
schema.index({ profileId: 1, trackId: 1 });

module.exports = model('reactTrack', schema);
