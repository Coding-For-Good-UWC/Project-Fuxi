const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        ethnicity: {
            type: String,
            required: true,
        },
        birthdate: {
            type: Date,
            required: true,
        },
        birthplace: {
            type: String,
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
        trackRatings: [
            {
                track: {
                    type: Types.ObjectId,
                    ref: 'tracks',
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
            },
        ],
        manualPlayset: [
            {
                trackid: {
                    type: Types.ObjectId,
                    required: true,
                },
            },
        ],
        institute: {
            type: Types.ObjectId,
            required: true,
            ref: 'institutes',
        },
        password: {
            type: String,
            required: true,
            selected: false,
        },
    },
    { timestamps: true },
);

schema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = model('patients', schema);
