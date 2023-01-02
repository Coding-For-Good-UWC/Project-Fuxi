const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema (
    {
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
        }
    }, 
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

schema.virtual("patients", { // institute.patients
    ref: "patients", 
    localField: "_id", // patient points to institute by id
    foreignField: "institute", // patients have institute property
    justOne: false
})

// frontend: res.json institute.patients to frontend

module.exports = model ("institutes", schema); 