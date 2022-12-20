const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema ({
    uri: 
    {
        type: String, 
        unique: true, 
        required: true
    }, 
    name: 
    {
        type: String, 
        required: true
    },
    artist: 
    {
        type: String, 
        required: true
    }, 
    imageUrl: 
    {
        type: String, 
        required: true
    }
})

module.exports = model ("tracks", schema); 