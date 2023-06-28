const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema ({
    name: 
    {
        type: String, 
        required: true
    }, 
    age: 
    {
        type: Number, 
        required: true
    }, 
    ethnicity: 
    {
        type: String, 
        required: true
    }, 
    birthdate: 
    {
        type: Date, 
        required: true
    }, 
    birthplace: 
    {
        type: String, 
        required: true
    }, 
    language: 
    {
        type: String, 
        required: true
    }, 
    genres: 
    [{
        type: String, 
        required: true
    }], 
    trackRatings: 
    [{
        track: { 
            type: Types.ObjectId, 
            ref: "tracks", 
            required: true 
        }, 
        rating: { 
            type: Number, 
            required: true
        }
    }], 
    manualPlayset: 
    [{
        id: { 
            type: String, 
            required: true 
        }, 
        rating: { 
            type: Number, 
            required: true
        }
    }], 
    requestedSongs:
    [{
        type: String
    }],
    institute: 
    {
        type: Types.ObjectId, 
        required: true, 
        ref: "institutes"
    }
})

module.exports = model ("patients", schema); 