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
        required: false
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
        required: false
    },
    ImageURL:
    {
        type: String,
        unique: false,
        required: true
    }
})

module.exports = model ("tracks", schema); 
