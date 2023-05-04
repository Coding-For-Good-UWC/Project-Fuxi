const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema ({
    Title:
    {
        type: String, 
        unique: false,
        required: true
    },
    URI:
    {
        type: String,
        unique: true, 
        required: true
    },
    Artist:
    {
        type: String,
        unique: false,
        required: true
    },
    Language:
    {
        type: String,
        unique: false,
        required: true
    },
    Genre:
    {
        type: String,
        unique: false,
        required: true
    },
    ImageURL:
    {
        type: String,
        unique: false,
        required: true
    }
})

module.exports = model ("tracks", schema); 