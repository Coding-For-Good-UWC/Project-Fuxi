const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

schema.virtual('patients', {
    // institute.patients
    ref: 'patients',
    localField: '_id', // patient points to institute by id
    foreignField: 'institute', // patients have institute property
    justOne: false,
});

module.exports = model('institutes', schema);
