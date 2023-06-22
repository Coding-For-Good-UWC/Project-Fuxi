const fetch = require("node-fetch");

const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const trackModel = require("../models/track");
const patientModel = require("../models/patient");

const updateTrackRating = async (req, res) => {
    console.log ("CALLED UPDATE TRACK RATING"); 

    try
    {
        const { patientId, trackId, rating } = req.body;

        console.log (req.body)

        if (!patientId || !trackId || rating === undefined)
            return res.status(400).json({ status: "ERROR", message: "Patient id, track id and rating required" });

        const patient = await patientModel.findById(patientId);

        if (!patient)
            return res.status(404).json({ status:"ERROR", message: "No patient by id " + patientId });

        const track = await trackModel.findById(trackId);

        if (!track)
            return res.status(404).json({ status: "ERROR", message: "No track by id " + trackId });

        patient.trackRatings.push({ track: track._id, rating });
        await patient.save();

        // console.log for example increased rating for trackid {trackid} by {rating change}, so it is now {rating}
        console.log("Increased rating for trackid " + trackId + " by " + rating + ", so it is now " + patient.trackRatings.find((trackRating) => trackRating.track == trackId).rating);

        res.status(200).json({ status: "OK", message: "Track rating updated successfully" });
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({ status: "ERROR", message: "Something went wrong" });
    }
};

const getNextTrackId = async (req, res) => {
    const { patientId } = req.body;

    if (!patientId)
        return res.status(400).json({ status: "ERROR", message: "Patient id required" });

    const patient = await patientModel.findById(patientId);

    if (!patient)
        return res.status(404).json({ status: "ERROR", message: "No patient by id " + patientId });

    const trackRatings = patient.trackRatings.reduce(
        (acc, { track, rating }) => ({
            ...acc,
            [track]: acc[track] !== undefined ? acc[track] + rating : rating,
        }),
        {}
    );

    if (Object.values(trackRatings).every((rating) => rating <= 0)) {
        const genres = patient.genres;
        const tracks = await trackModel.find({ Genre: { $in: genres } });
        tracks.forEach((track) =>
            patient.trackRatings.push({ track: track._id, rating: 1 })
        );
        await patient.save();
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
            const trackObj = await trackModel.findById(track);
            return res.json({
                track: trackObj,
                status: "OK",
                message:
                    "Returning a random track based on weighted average of weightings",
            });
        }
    }

    return res.status(500).json({ status: "ERROR", message: "Something went wrong" });
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
		
	// console.log(patient.trackRatings);
    const query = patient.ethnicity + " " + patient.language + " " + patient.genres.join(" ") + " " + patient.birthplace + " -compilation -playlist -top -best -songs -mix -hits" ; // + " " + (Date.now() - patient.birthdate).toString();
    
	let response = await fetch("http://127.0.0.1:5000/api/search/"+query).then(res => res.json())
	const tracks = response.tracks;
	// console.log(tracks);
	for (let i = 0; i < tracks.length; i++) {
		// Try and find the track in the database if it already exists by its URI
		const track = await trackModel.findOne({ URI: tracks[i]['vid'] });
		if (track) {
            console.log ("Found track");
			tracks[i] = track;
		} else {
            console.log("Creating track");
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
            "../temp",
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

module.exports = { getNextTrackId, getTrack, playTrack, scrapeTracks, updateTrackRating };
