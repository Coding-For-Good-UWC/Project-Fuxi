// const fetch = require ("node-fetch"); 

const trackModel = require("../models/track"); 
const patientModel = require("../models/patient"); 

// { 
// 	"patientId": "63aa684762a0f822a9a2a5ca", 
// 	"trackId": "63a12ee8e733c3b2acc5ccef", 
// 	"rating": -1
// }
const getNextTrackId = async (req, res) => 
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
    
    if (rating != 0)
    {
        const track = await trackModel.findById(trackId); 
            
        if (!track)
            return res.status(404).json({ message: "No track by id " + trackId }); 

        patient.trackRatings.push({ track: track._id, rating }); 
        await patient.save(); 
    }
    
    const trackRatings = patient.trackRatings.reduce((acc, { track, rating }) => ({ 
        ...acc, 
        [track]: acc[track] !== undefined ? acc[track] + rating : rating
    }), {}); 

    console.log ("TRACK RATINGS")
    console.log (trackRatings);

    // If there are no positive tracks, add every track to the patient's trackRatings array with a rating of 0 for the genres they like
    if (Object.values(trackRatings).every(rating => rating <= 0))
    {
        const genres = patient.genres; 
        console.log ("GENRES")
        console.log(genres)
        // Get all tracks in the trackModel where genre is in the genre array
        const tracks = await trackModel.find({ Genre: { $in: genres } });
        console.log ("TRACKS:")
        console.log(tracks)
        // Add every track to the patient's trackRatings array with a rating of 1
        tracks.forEach(track => patient.trackRatings.push({ track: track._id, rating: 1 }));
        console.log ("TRACK RATINGS:")
        console.log (patient.trackRatings)

        await patient.save();

        console.log ("SAVED"); 

        // Pick random track from the tracks array
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

        console.log ("RANDOM TRACK"); 
        console.log (randomTrack); 

        return res.json({ trackId: randomTrack._id, status: "OK", message: "No positive tracks, returning a random track based on patient's genre preferences (" + genres.join(", ") + ")" });
    }

    const positiveTracks = Object.entries(trackRatings).filter(([track, rating]) => rating != -1).map(([track, rating]) => ({ track, rating: rating + 1 })); 
    console.log ("POSITIVE TRACKS")
    console.log (positiveTracks);

    const totalScore = positiveTracks.reduce((acc, { track, rating }) => acc + rating, 0); 

    let diceRoll = Math.floor(Math.random() * totalScore); 
    for (let { track, rating } of positiveTracks)
    {
        diceRoll -= rating; 

        if (diceRoll <= 0)
            return res.json({ trackId: track, status: "OK", message: "Returning a random track based on weighted average of weightings" }); 
    }

    return res.status(500).json({ message: "Something went wrong"}); 
} 

// Write an async function that returns the track object given its id
const getTrack = async (req, res) =>
{
    const { id } = req.body;

    console.log ("SEARCHING FOR TRACK BY ID " + id); 

    if (!id)
        return res.status(400).json({ status: "ERROR", message: "Track id required" });

    const track = await trackModel.findById(id);

    console.log (track)

    // if (!track)
    //     return res.status(404).json({ status: "ERROR", message: "No track by id " + id });
    
    return res.status(200).json({ track, status: "OK", message: "Found track by id " + id });
}

// Write an async function that finds all the unique values for Genre in the Track collection.
// Return the list of unique values.
// const getGenres = async (req, res) =>
// {
//     const genres = await trackModel.distinct("Genre");
//     console.log(genres);
//     return res.status(200).json({ data: genres, status: "OK" }); 
// }

module.exports = { getNextTrackId, getTrack }; 
