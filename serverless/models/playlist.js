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
                ref: 'tracks',
            },
        ],
    },
    { timestamps: true },
);
schema.index({ profileId: 1 });

const PlaylistModel = model('playlist', schema);

module.exports = { PlaylistModel };
