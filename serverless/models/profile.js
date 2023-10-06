const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
    {
        uid: {
            type: String,
            unique: true,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        yearBirth: {
            type: Date,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        genres: [
            {
                type: String,
                required: true,
            },
        ],
        description: {
            type: String,
        },
    },
    { timestamps: true },
);

module.exports = model('profiles', schema);
