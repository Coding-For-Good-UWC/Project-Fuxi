const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
    {
        profileId: {
            type: Types.ObjectId,
            unique: true,
            required: true,
        },
        reactTracks: [
            {
                track: {
                    type: Types.ObjectId,
                    ref: 'tracks',
                    required: true,
                },
                preference: {
                    type: String,
                    enum: ['strongly dislike', 'dislike', 'like', 'strongly like'],
                },
            },
        ],
    },
    { versionKey: false },
);
schema.index({ profileId: 1 });

const ProfileReactModal = model('profileReact', schema);

module.exports = { ProfileReactModal };
