const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
    {
        profileId: {
            type: Types.ObjectId,
            required: true,
        },
        namePlaylist: {
            type: String,
            required: true,
        },
        tracks: [
            {
                type: Types.ObjectId,
                required: true,
            },
        ],
    },
    { timestamps: true },
    { versionKey: false },
);

module.exports = model('playlist', schema);
