// const mongoose = require ("mongoose");

// const { Schema, model, Types } = mongoose; 

// const schema = new Schema (
//     {
//         username: 
//         {
//             type: String, 
//             unique: true, 
//             required: true
//         }, 
//         password: 
//         {
//             type: String, 
//             required: true
//         }
//     }, 
//     {
//         toJSON: { virtuals: true },
//         toObject: { virtuals: true },
//     }
// )

// schema.virtual("patients", { // caregiver.patients
//     ref: "patients", 
//     localField: "_id", // patient points to caregiver by id
//     foreignField: "caregiver", // patients have caregiver property
//     justOne: false
// })

// // frontend: res.json caregiver.patients to frontend

// module.exports = model ("caregivers", schema); 