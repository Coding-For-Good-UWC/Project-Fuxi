const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const schema = new Schema(
    {
        uid: {
            type: String,
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        yearBirth: {
            type: Date,
        },
        genres: [
            {
                type: String,
            },
        ],
        description: {
            type: String,
        },
    },
    { timestamps: true }
);
schema.index({ uid: 1 });

const ProfileModel = model('profiles', schema);

module.exports = { ProfileModel };
