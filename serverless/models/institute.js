const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const { Schema, model, Types } = mongoose;

const schema = new Schema(
    {
        uid: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            selected: false,
        },
        OTPResetPassword: {
            type: Number,
        },
    },
    { timestamps: true },
);
schema.index({ uid: 1, email: 1 });

schema.pre('save', async function (next) {
    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

schema.virtual('patients', {
    // institute.patients
    ref: 'patients',
    localField: '_id', // patient points to institute by id
    foreignField: 'institute', // patients have institute property
    justOne: false,
});

module.exports = model('institutes', schema);
