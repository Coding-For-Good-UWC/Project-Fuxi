const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

// name, 
// age, 
// ethnicity, 
// birthdate, 
// birthplace, 
// language

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
        type: String
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
    caregiver: 
    {
        type: Types.ObjectId, 
        required: true, 
        ref: "caregivers"
    }
})

module.exports = model ("patients", schema); 