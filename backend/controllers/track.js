// const fetch = require ("node-fetch"); 

const trackModel = require("../models/track"); 
const patientModel = require("../models/patient"); 

// { 
// 	"patientId": "63aa684762a0f822a9a2a5ca", 
// 	"trackId": "63a12ee8e733c3b2acc5ccef", 
// 	"rating": -1
// }
const getNextTrack = async (req, res) => 
{ 
    const { patientId, trackId, rating } = req.body; 

    if (!patientId || !trackId || rating === undefined)
        return res.status(400).json({ message: "Patient id, track id and rating required"}); 

    if (rating < -1 || rating > 1)
        return res.status(400).json({ message: "Score must be a valid integer between -1 and 1" }); 

    // const response = await fetch ('http://localhost:8080/patient/getPatient', {
    //     method: "POST", 
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ id: patientId })
    // }); 
    // const patient = await response.json (); 
    const patient = await patientModel.findById(patientId); 

    if (!patient)
        return res.status(404).json({ message: "No patient by id " + patientId }); 
        
    const track = await trackModel.findById(trackId); 
        
    if (!track)
        return res.status(404).json({ message: "No track by id " + trackId }); 

    if (rating != 0)
    {
        patient.trackRatings.push({ track: track._id, rating }); 
        await patient.save(); 
    }
    
    const trackRatings = patient.trackRatings.reduce((acc, { track, rating }) => ({ 
        ...acc, 
        [track]: acc[track] !== undefined ? acc[track] + rating : rating
    }), {}); 

    const positiveTracks = Object.entries(trackRatings).filter(([track, rating]) => rating != -1).map(([track, rating]) => ({ track, rating: rating + 1 })); 

    const totalScore = positiveTracks.reduce((acc, { track, rating }) => acc + rating, 0); 

    let diceRoll = Math.floor(Math.random() * totalScore); 
    for (let { track, rating } of positiveTracks)
    {
        diceRoll -= rating; 

        if (diceRoll <= 0)
            return res.json({ data: track, status: "ok" }); 
    }

    return res.status(500).json({ message: "Something went wrong "}); 
} 

// Write an async function that finds all the unique values for Genre in the Track collection.
// Return the list of unique values.
// const getGenres = async (req, res) =>
// {
//     const genres = await trackModel.distinct("Genre");
//     console.log(genres);
//     return res.status(200).json({ data: genres, status: "ok" }); 
// }

module.exports = { getNextTrack }; 
