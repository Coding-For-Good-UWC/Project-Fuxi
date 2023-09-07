const mongoose = require ("mongoose");

const { Schema, model, Types } = mongoose; 

const schema = new Schema (
    {
        uid:
        {
            type: String,
            unique: true,
            required: true
        },
        email:
        {
            type: String,
            unique: true,
            required: true
        },
        name:
        {
            type: String,
            required: true,
            unique: true
        }
    }
)

schema.virtual("patients", { // institute.patients
    ref: "patients", 
    localField: "_id", // patient points to institute by id
    foreignField: "institute", // patients have institute property
    justOne: false
})

module.exports = model ("institutes", schema); 