const fetch = require("node-fetch");

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const trackModel = require("../models/track");
const patientModel = require("../models/patient");

// {
// 	"patientId": "63aa684762a0f822a9a2a5ca",
// 	"trackId": "63a12ee8e733c3b2acc5ccef",
// 	"rating": -1
// }
// For first track played, pass a rating of 0 and any track id (won't matter)
const getNextTrackId = async (req, res) => {
    const { patientId, trackId } = req.body;
    let { rating } = req.body;

    if (!patientId || !trackId || rating === undefined)
        return res
            .status(400)
            .json({ message: "Patient id, track id and rating required" });

    // TEMPORARILY MAP 1-5 RATING TO -1-1 SCALE
    if (rating <= 2) rating = -1;
    if (rating == 3) rating = 0;
    if (rating >= 4) rating = 1;

    if (rating < -1 || rating > 1)
        return res
            .status(400)
            .json({
                message: "Score must be a valid integer between -1 and 1",
            });

    const patient = await patientModel.findById(patientId);

    if (!patient)
        return res
            .status(404)
            .json({ message: "No patient by id " + patientId });

    if (rating != 0) {
        const track = await trackModel.findById(trackId);

        if (!track)
            return res
                .status(404)
                .json({ message: "No track by id " + trackId });

        patient.trackRatings.push({ track: track._id, rating });
        await patient.save();
    }

    const trackRatings = patient.trackRatings.reduce(
        (acc, { track, rating }) => ({
            ...acc,
            [track]: acc[track] !== undefined ? acc[track] + rating : rating,
        }),
        {}
    );

    // If there are no positive tracks, add every track to the patient's trackRatings array with a rating of 0 for the genres they like
    if (Object.values(trackRatings).every((rating) => rating <= 0)) {
        const genres = patient.genres;
        // Get all tracks in the trackModel where genre is in the genre array
        const tracks = await trackModel.find({ Genre: { $in: genres } });
        // Add every track to the patient's trackRatings array with a rating of 1
        tracks.forEach((track) =>
            patient.trackRatings.push({ track: track._id, rating: 1 })
        );
        await patient.save();
        // Pick random track from the tracks array
        const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];

        return res.json({
            trackId: randomTrack._id,
            status: "OK",
            message:
                "No positive tracks, returning a random track based on patient's genre preferences (" +
                genres.join(", ") +
                ")",
        });
    }

    const positiveTracks = Object.entries(trackRatings)
        .filter(([track, rating]) => rating != -1)
        .map(([track, rating]) => ({ track, rating: rating + 1 }));

    const totalScore = positiveTracks.reduce(
        (acc, { track, rating }) => acc + rating,
        0
    );

    let diceRoll = Math.floor(Math.random() * totalScore);
    for (let { track, rating } of positiveTracks) {
        diceRoll -= rating;

        if (diceRoll <= 0) {
            console.log("RETURNING TRACK ID " + track);
            return res.json({
                trackId: track,
                status: "OK",
                message:
                    "Returning a random track based on weighted average of weightings",
            });
        }
    }

    return res.status(500).json({ message: "Something went wrong" });
};

// Async function that returns the track object given its id
const getTrack = async (req, res) => {
    const { id } = req.body;

    if (!id)
        return res
            .status(400)
            .json({ status: "ERROR", message: "Track id required" });

    const track = await trackModel.findById(id);
    console.log("FOUND TRACK " + track);
    return res
        .status(200)
        .json({ track, status: "OK", message: "Found track by id " + id });
};

const scrapeTracks = async (req, res) =>
{
	console.log("Scraping tracks");
	const { patientId } = req.body;
	const patient = await patientModel.findById(patientId);
		
	console.log(patient.trackRatings);
    const query = patient.ethnicity + " " + patient.language + " " + patient.genres.join(" ") + " " + patient.birthplace + " -compilation -playlist -top -best -songs -mix -hits" ; // + " " + (Date.now() - patient.birthdate).toString();
    
	let response = await fetch("http://127.0.0.1:5000/api/search/"+query).then(res => res.json())
	const tracks = response.tracks;
	console.log(tracks);
	for (let i = 0; i < tracks.length; i++) {
		// Try and find the track in the database if it already exists by its URI
		const track = await trackModel.findOne({ URI: tracks[i]['vid'] });
		if (track) {
			tracks[i] = track;
		} else {
			let doc = await trackModel.create({
				Title: tracks[i]['title'],
				URI: tracks[i]['vid'],
				Artist: tracks[i]['author'],
				Language: patient.language,
				Genre: patient.genres[0],
				ImageURL: tracks[i]['thumb'],
			})
			tracks[i] = doc;
		}
	}
		
	tracks.forEach(t => patient.trackRatings.push({ track: t._id, rating: 3 }));

	await patient.save();
    return res.status(200).json({ status: "OK", message: "Found tracks for patient: " + patientId });

}

// Async function that serves the audio stream of a YouTube video given its URL
// Temporary audio files are saved in the temp folder
// Using ytdl to get the audio URL and ffmpeg to convert the audio format
// Frontend example can be found here: https://github.com/antoinekllee/youtube-audio-streamer/blob/main/App.js
const playTrack = async (req, res) => {
    const videoUrl = req.query.videoUrl;
    try {
        const info = await ytdl.getInfo(videoUrl);
        const audioURL = ytdl.chooseFormat(info.formats, {
            filter: "audioonly",
        }).url;

        // Define the output file path
        const outputFilePath = path.join(
            __dirname,
            "temp",
            `${Date.now()}.mp3`
        );

        // Create a writable stream to save the converted audio
        const writeStream = fs.createWriteStream(outputFilePath);

        // Use FFmpeg to convert the audio format
        ffmpeg()
            .input(audioURL)
            .format("mp3")
            .audioCodec("libmp3lame")
            .pipe(writeStream);

        // When the conversion is done, send the URL of the converted file
        writeStream.on("finish", () => {
            res.json({
                audioURL: `${req.protocol}://${req.get(
                    "host"
                )}/temp/${path.basename(outputFilePath)}`,
            });
        });

        // Handle errors during the conversion
        writeStream.on("error", (error) => {
            console.error("Error during audio conversion:", error);
            res.status(500).json({ error: "Error during audio conversion" });
        });
    } catch (error) {
        console.error("Error fetching audio URL:", error);
        res.status(500).json({ error: "Error fetching audio URL" });
    }
};

module.exports = { getNextTrackId, getTrack, playTrack, scrapeTracks };
