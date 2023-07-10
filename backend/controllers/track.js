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


const buildYtQueries = (patient) => {
    const era = Math.floor((patient.birthdate.getTime() / (1000 * 60 * 60 * 24 * 365) + 18) / 10 ) * 10 + 1960;
    const queryEraRange = Array.from({length: 3}, (_, i) => era + (i - 1) * 50); // generates an array of eras from era - 50 to era + 50 in steps of 10.
    let queries = [];

    const queryFormats = [
        (attr, era) => `${attr} songs from the ${era}'s`,
        (attr, era) => `${era}'s ${attr} music`,
        (attr, era) => `${era}'s ${attr} songs`,
        (attr, era) => `${attr} music from the ${era}'s`,
        (attr, era) => `${attr} tunes from the ${era}'s`,
        (attr, era) => `songs from the ${era}'s in ${attr}`,
        (attr, era) => `music from the ${era}'s in ${attr}`,
        (attr, era) => `${era}'s songs in ${attr}`,
        (attr, era) => `${era}'s music in ${attr}`,
        (attr, era) => `tunes from the ${era}'s in ${attr}`
    ];

    const generateQueries = (era, attribute) => {
        const format = queryFormats[Math.floor(Math.random() * queryFormats.length)];
        return format(attribute, era);
    }

    queryEraRange.forEach((era) => {
        queries.push(generateQueries(era, patient.language));
        queries.push(generateQueries(era, patient.genres.join(" ")));
        queries.push(generateQueries(era, (patient.birthplace + " " + patient.ethnicity)));
    });

    console.log(queries);

    return queries;
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
        console.log ("GETTING NEXT TRACK ID")
        
        const { patientId, prevTrackId } = req.body;

        if (!patientId)
            return res
                .status(400)
                .json({ status: "ERROR", message: "Patient id required" });

        const patient = await patientModel.findById(patientId);

        // Count how many tracks have a rating above 0
        let validTracks = patient.trackRatings.filter(
            (trackRating) => trackRating.rating > 0
        );

        console.log ("validTrackCount: " + validTracks.length)

        if (validTracks.length < 15)
        {
            console.log ("LESS THAN 15 VALID TRACKS, FIRST CHECKING SAMPLES")
            // first we see if there are samples that we can add that aren't already in the playset
            const sampleTracks = await trackModel.find({ Sample: true, Language: patient.language, _id: { $nin: patient.manualPlayset } });
            
            // we randomly select 15 - validTracks.length sample tracks
            const sampleTracksToAdd = sampleTracks.sort(() => Math.random() - 0.5).slice(0, 15 - validTracks.length);

            // add them to the patient's trackRatings array
            sampleTracksToAdd.forEach((track) => {
                patient.trackRatings.push({ track: track._id, rating: 3 })
            });
        }

        validTracks = patient.trackRatings.filter(
            (trackRating) => trackRating.rating > 0
        );

        if (validTracks.length < 15) // if still less than 15 tracks, scrape from yt
        {
            console.log ("STILL LESS THAN 15 VALID TRACKS, SCRAPING YT")
            await scrapeTracksFn(patientId, 15 - validTracks);
            // BUG: Yt scraper returns the exact same tracks every time. May not be able to add more tracks.
        }

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

const getNextTrackIdRandom = async (req, res) => {
    try {
        const { patientId } = req.body;

        if (!patientId)
            return res
                .status(400)
                .json({ status: "ERROR", message: "Patient id required" });

        const patient = await patientModel.findById(patientId);

        if (patient.manualPlayset.length <= 5)
            return res.status(500).json({ status: "ERROR", message: "songs" });

        const randomIndex = Math.floor(Math.random() * patient.manualPlayset.length);
        console.log(randomIndex)
        const trackObj =  patient.manualPlayset[randomIndex]
        console.log("track"+trackObj)
        return res.json({
            track: trackObj,
            status: "OK",
            message: "Returning a random track from patient's manual playset",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "ERROR", message: "Server error" });
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
    console.log(ids)
    let titles = [];
    let x;
    for(let i=0;i<ids.length;i++){
        const myObjectId = new ObjectId(ids[i]);
        const result = await trackModel.findOne({_id: myObjectId});
        titles.push(result)
    }
    return res.status(200).json({ titles, status: "OK", message: "Found titles"});
};

const filterTrack = (track) => 
{
    if (track.duration > (1000 * 60 * 10)) // 10 minutes
    {
        console.log ("FILTERED TRACK: " + track.name + " BECAUSE OF DURATION");
        return false;
    }

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
		"100",
		"25",
		"20",
		"10",
		"5"
    ];
    // Filter by negative keywords
    for (let word of negativeWords) 
    {
        if (track.name.toLowerCase().includes(word))
        {
            console.log ("FILTERED TRACK: " + track.name + " BECAUSE OF " + word);
            return false;
        }
    }

    return true;
};

// Scrape tracks for patient's initial automatic playset
// It is a 3 pass process:
// 1. Search for 15 sample songs from the range of the era's decade e.g. 1960 to 1969 for an era of 1960 for the given language
// 2. If less than 15 songs, retrieve all sample tracks for the language, ignoring era, and sort by distance from the era
// 3. If still less than 15 songs, search youtube and filter the results. If a yt track already exists in the database, use that instead. If not, create a new track in the database
const scrapeTracks = async (req, res) => {
    const { patientId } = req.body;

    const patient = await patientModel.findById(patientId);
    const era = Math.floor((patient.birthdate.getTime() / (1000 * 60 * 60 * 24 * 365) + 18) / 10 ) * 10 + 1960;
    
    // Get 15 songs from the range of the era's decade e.g. 1960 to 1969 for an era of 1960
    let tracks = await trackModel.find({ Sample: true, Language: patient.language, Era: { $gte: era, $lt: era + 10 } });

    // If length of tracks is more than 15, randomly select 15 tracks
    if (tracks.length > 15)
    {
        tracks = tracks.sort(() => Math.random() - 0.5).slice(0, 15);
    }

    console.log ("TRACKS 1")
    console.log (tracks)

    // if less than 15 songs
    if (tracks.length < 15) 
    {
        // Retrieve all tracks, ignoring era
        const allTracks = await trackModel.find({ Language: patient.language, Sample: true });

        // Sort by distance from the era
        const sortedTracks = allTracks.sort((a, b) => Math.abs(a.Era - era) - Math.abs(b.Era - era));

        // Add the remaining songs from the start of the sorted list
        for (let i = 0; i < 15 - tracks.length; i++)
            tracks.push(sortedTracks[i]);
    }

    tracks.forEach((track) => 
    { 
        patient.trackRatings.push({ track: track._id, rating: 3 }) 
    });

    if (tracks.length < 15) 
    {
        await scrapeTracksFn(patientId, 15 - tracks.length);
    }

    await patient.save();

    return res
        .status(200)
        .json({
            status: "OK",
            message: "Found tracks for patient: " + patientId,
        });
};

const scrapeTracksFn = async (patientId, numOfTracksToAdd) => 
{
    const patient = await patientModel.findById(patientId);
    const queries = buildYtQueries(patient);

    const newTracks = [];

    for (let query of queries) // will go through each query until we have enough tracks
    {
        console.log ("QUERYING YOUTUBE WITH QUERY: " + query)
        let response = await api.search(query, "song");
        console.log (response.content.length + " RESULTS FROM YOUTUBE")
        let ytTracks = response.content.filter(track => filterTrack(track));
        ytTracks = ytTracks.slice(0, numOfTracksToAdd);
        
        for (let ytTrack of ytTracks) 
        {
            // Check if a track with the same URI already exists in the database
            const track = await trackModel.findOne({ URI: ytTrack.videoId });
            if (track)
            {
                console.log ("YT TRACK ALREADY FOUND IN DB: " + track.Title);
                newTracks.push(track);
            }
            else
            {
                console.log ("ADDING NEW TRACK FROM YOUTUBE: " + ytTrack.name);

                const track = await trackModel.create
                ({
                    Title: ytTrack.name,
                    URI: ytTrack.videoId,
                    Artist: ytTrack.artist ? ytTrack.artist.name : "",
                    Language: patient.language,
                    Genre: null,
                    ImageURL: ytTrack.thumbnails ? ytTrack.thumbnails[0].url : "",
                    Year: ytTrack.year || "",
                });
                newTracks.push(track);
            }
        }

        if (newTracks.length >= numOfTracksToAdd)
            break;
    }

    newTracks.forEach((track) =>
    {
        patient.trackRatings.push({ track: track._id, rating: 3 })
    });

    await patient.save();    
}

const scrapeYtTrack = async (req, res) =>
{
    const query = req.body.searchQuery;

	let response = await api.search(query, "song");
    console.log (response.content.length + " FROM YOUTUBE")

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

const playTrackShuffle = async (req, res) => {
    const videoUrl = req.body
    const patientId = req.query.patientId;
    try {

        const info = await ytdl.getInfo(videoUrl);
        const audioURL = ytdl.chooseFormat(info.formats, {
            filter: "audioonly",
        }).url;

        // Use FFmpeg to convert the audio format
        ffmpeg()
            .input(audioURL)
            .format("mp3")
            .audioCodec("libmp3lame")
            .pipe(writeStream);

    
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

const cleanTempFolder = (req, res) => {
    try
    {
        const { keepFiles, patientId } = req.body;

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
    getNextTrackIdRandom,
    getTrack,
    playTrack,
    scrapeTracks,
    updateTrackRating,
    getTitles,
    scrapeYtTrack,
    cleanTempFolder
};
