const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const schema = new Schema({
    Title: {
        type: String,
        unique: false,
        required: true,
    },
    YtId: {
        type: String,
        unique: true,
        required: true,
    },
    Artist: {
        type: String,
        unique: false,
        required: false,
    },
    Language: {
        type: String,
        unique: false,
        required: true,
    },
    Genre: {
        type: String,
        unique: false,
        required: false,
    },
    ImageURL: {
        type: String,
        unique: false,
        required: true,
    },
    Era: {
        type: Number,
        unique: false,
        required: false,
    },
    // store uri to loaded mp3 file from s3 bucket
    URI: {
        type: String,
        unique: false,
        required: false,
    },
});
schema.index({ Title: 1 });

const TrackModel = model('tracks', schema);

module.exports = { TrackModel };
