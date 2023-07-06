require("dotenv").config();
const fetch = require("node-fetch");

const YoutubeMusicApi = require("youtube-music-api");

const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

const fs = require("fs");
const path = require("path");
const ObjectId = require('mongoose').Types.ObjectId;

// const { OpenAI } = require("langchain/llms/openai");
// const { initializeAgentExecutorWithOptions } = require("langchain/agents");

const trackModel = require("../models/track");
const patientModel = require("../models/patient");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const api = new YoutubeMusicApi();
api.initalize();

// const llm = OpenAI({ temperature: 0.9 });
// const executor = initializeAgentExecutorWithOptions({[], llm, {
// 	agentType: "zero-shot-react-description",
// 	verbose: true,
// });


const generatePrompts = (patient) => {
    const era =
        Math.floor(
            (patient.birthdate.getTime() / (1000 * 60 * 60 * 24 * 365) + 18) /
                10
        ) *
            10 +
        1970;
    return [
        // patient.ethnicity + " " + patient.language + " songs",
        // patient.language + " " + patient.genres.join(" ") + " songs",
        patient.language + " songs from the " + era + "'s",
    ];
};

const updateTrackRating = async (req, res) => {
    try {
        const { patientId, trackId, rating } = req.body;

        if (!patientId || !trackId || rating === undefined)
            return res
                .status(400)
                .json({
                    status: "ERROR",
                    message: "Patient id, track id and rating required",
                });

        const patient = await patientModel.findById(patientId);

        if (!patient)
            return res
                .status(404)
                .json({
                    status: "ERROR",
                    message: "No patient by id " + patientId,
                });

        const track = await trackModel.findById(trackId);

        if (!track)
            return res
                .status(404)
                .json({
                    status: "ERROR",
                    message: "No track by id " + trackId,
                });

        // update the rating in the patient's trackRatings array. it should be the old rating + rating (change in rating)
        patient.trackRatings.find(
            (trackRating) => trackRating.track == trackId
        ).rating += rating;
        await patient.save();

        res.status(200).json({
            status: "OK",
            message: "Track rating updated successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "ERROR",
            message: "Something went wrong",
        });
    }
};


const getNextTrackId = async (req, res) => {
    try {
        const { patientId, prevTrackId } = req.body;

        if (!patientId)
            return res
                .status(400)
                .json({ status: "ERROR", message: "Patient id required" });

        const patient = await patientModel.findById(patientId);

        if (patient.trackRatings.length <= 15)
            updated = await scrapeTracksFn(patientId);

        const trackRatings = patient.trackRatings.reduce(
            (acc, { track, rating }) => ({
                ...acc,
                [track]:
                    acc[track] !== undefined ? acc[track] + rating : rating,
            }),
            {}
        );

        const positiveTracks = Object.entries(trackRatings)
            .filter(([track, rating]) => rating != -1)
            .map(([track, rating]) => ({ track, rating: rating + 1 }));

        const totalScore = positiveTracks.reduce(
            (acc, { track, rating }) => acc + rating,
            0
        );

        let trackObj;
        let trackSelectedId;
        let sameTrackCounter = 0;
        do {
            let diceRoll = Math.floor(Math.random() * totalScore);
            for (let { track, rating } of positiveTracks) {
                diceRoll -= rating;
    
                if (diceRoll <= 0) {
                    trackObj = await trackModel.findById(track);
                    trackSelectedId = track;
                    break;
                }
            }
            
            if (prevTrackId !== -1 && trackSelectedId === prevTrackId) {
                console.log("Same track selected, rerolling");
                sameTrackCounter += 1;
            }
        } while (prevTrackId === trackSelectedId && sameTrackCounter < 5);

        return res.json({
            track: trackObj,
            status: "OK",
            message: "Returning a random track weightings",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "ERROR", message: "Server error" });
    }
};

// Async function that returns the track object given its id
const getTrack = async (req, res) =>
{
    const { id } = req.body;

    if (!id)
        return res.status(400).json({ status: "ERROR", message: "Track id required" });

    const track = await trackModel.findById(id);

    return res.status(200).json({ track, status: "OK", message: "Found track by id " + id });
}
const getTitles = async (req, res) => {
    const test = req.query
    const ids = req.query.ids.split(',');
    let titles = [];
    let x;
    for(let i=0;i<ids.length;i++){
        const myObjectId = new ObjectId(ids[i]);

        const result = await trackModel.findOne({_id: myObjectId});
    }
    return res.status(200).json({ titles, status: "OK", message: "Found titles"});
  };


 

const filterTrack = (track) => {
    // async (track) => {

    // Filter duration < 5mins
    // video_metadata = await ytdl.getInfo(track.vid);
    // if (video_metadata.length_seconds > 300) {
    // 	return false;

    const negativeWords = [
        "mix",
        "mashup",
        "compilation",
        "medley",
        "best",
        "top",
        "mashup",
        "nonstop",
		"lofi",
		"hits",
    ];
    // TODO: ChatGPT filter
    // Filter by negative keywords
    for (let word of negativeWords)
        if (track.name.toLowerCase().includes(word)) return false;

    return true;
};

const scrapeTracks = async (req, res) => {
    const { patientId } = req.body;
    await scrapeTracksFn(patientId);
    return res
        .status(200)
        .json({
            status: "OK",
            message: "Found tracks for patient: " + patientId,
        });
};

const scrapeTracksFn = async (patientId) => {
    const patient = await patientModel.findById(patientId);
    const queries = generatePrompts(patient);

    var newTrackRatings = [];

	for (let query of queries) {

		let response = await api.search(query, "song");

		let tracks = Array(response.content.length);
		for (let i = 0; i < response.content.length; i++) {
			let tmp = response.content[i];
			if (await filterTrack(tmp)) {
				tracks[i] = {
					title: tmp.name,
					vid: tmp.videoId,
					thumb: tmp.thumbnails ? tmp.thumbnails[0].url : "",
					author: tmp.artist ? tmp.artist.name : "",
					year: tmp.year || "",
				};
			}
		}

		for (let i = 0; i < tracks.length; i++) {
			// Try and find the track in the database if it already exists by its URI
			if (tracks[i]) {
				const track = await trackModel.findOne({
					URI: tracks[i]["vid"],
				});
				if (track) {
					tracks[i] = track;
					newTrackRatings.push({ track: track._id, rating: 3 });
					patient.trackRatings.push({ track: track._id, rating: 3 });
				} else {
					let doc = await trackModel.create({
						Title: tracks[i]["title"],
						URI: tracks[i]["vid"],
						Artist: tracks[i]["author"],
						Language: patient.language,
						Genre: null,
						ImageURL: tracks[i]["thumb"],
					});
					tracks[i] = doc;
					newTrackRatings.push({ track: doc._id, rating: 3 });
					patient.trackRatings.push({ track: doc._id, rating: 3 });
				}
			}

		}
	}


	await patient.save();
    
}

const scrapeYtTrack = async (req, res) =>
{
    const query = req.body.searchQuery;

	let response = await api.search(query, "song");

    const tracks = response.content.slice(0,5);
    return(res.json({ tracks: tracks }));
}


// Async function that serves the audio stream of a YouTube video given its URL
// Temporary audio files are saved in the temp folder
// Using ytdl to get the audio URL and ffmpeg to convert the audio format
// Frontend example can be found here: https://github.com/antoinekllee/youtube-audio-streamer/blob/main/App.js
const playTrack = async (req, res) => {
    const videoUrl = req.query.videoUrl;
    const patientId = req.query.patientId;

    try {
        const outputFilePath = path.join(
            __dirname,
            "../temp",
            `${patientId}_${Date.now()}.mp3`
        );

        // Create a writable stream to save the converted audio
        const writeStream = fs.createWriteStream(outputFilePath);

        const audioStream = ytdl(videoUrl, {
            quality: "highestaudio",
            filter: (format) => format.container === "webm" && !format.encoding,
        });

        // Use FFmpeg to convert the audio format
        ffmpeg(audioStream)
            .audioCodec("libmp3lame")
            .format("mp3")
            .on("end", () => {
                res.json({
                    audioURL: `${req.protocol}://${req.get(
                        "host"
                    )}/temp/${path.basename(outputFilePath)}`,
                });
            })
            .on("error", (error) => {
                console.error("Error during audio conversion:", error);
                res.status(500).json({
                    error: "Error during audio conversion",
                });
            })
            .pipe(writeStream, { end: true });
    } catch (error) {
        console.error("Error fetching audio URL:", error);
        res.status(500).json({ error: "Error fetching audio URL" });
    }
};

const cleanTempFolder = (req, res) => {
    try
    {
        const { keepFiles, patientId } = req.body;

        console.log ("CLEANING TEMP FOLDER BUT KEEPING FILES")
        console.log (keepFiles)

        deleteFilesWithPrefix(`${patientId}_`, keepFiles);

        res.status(200).json({ status: "OK", message: "Temp folder cleaned" });
    }
    catch (error)
    {
        console.error("Error cleaning temp folder:", error);
        res.status(500).json({ error: "Error cleaning temp folder" });
    }
}

// To clean up the temp folder
const deleteFilesWithPrefix = (prefix, keepFiles) => {
    const tempFolderPath = path.join(__dirname, "../temp");
    fs.readdir(tempFolderPath, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            if (file.startsWith(prefix) && !keepFiles.includes(file)) {
                fs.unlink(path.join(tempFolderPath, file), (err) => {
                    if (err) throw err;
                });
            }
        });
    });
};

module.exports = {
    getNextTrackId,
    getTrack,
    playTrack,
    scrapeTracks,
    updateTrackRating,
    getTitles,
    scrapeYtTrack,
    cleanTempFolder,
};
