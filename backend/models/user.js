const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema ({
    username: 
    {
        type: String, 
        unique: true, 
        required: true
    }, 
    password: 
    {
        type: String, 
        required: true
    }, 
    trackRatings: 
    [{
        track: { 
            type: Types.ObjectId, 
            ref: "track", 
            required: true 
        }, 
        rating: { 
            type: Number, 
            required: true
        }
    }]
})

module.exports = model ("users", schema); 