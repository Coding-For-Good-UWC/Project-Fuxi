require('dotenv').config();
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const YoutubeMusicApi = require('youtube-music-api');
const ffmpegPath = require('ffmpeg-static');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const fs = require('fs');
const path = require('path');

const trackModel = require('../models/track');
const patientModel = require('../models/patient');
const { connectDb } = require('../lib/mongodb');
const { ApiResponse, HttpStatus } = require('../middlewares/ApiResponse');
connectDb();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const api = new YoutubeMusicApi();
api.initalize();

const updateTrackRating = async (event) => {
    const json = JSON.parse(event.body);
    try {
        const { patientId, trackId, rating } = json;

        if (!patientId || !trackId || rating === undefined) {
            return JSON.stringify({
                statusCode: 400,
                body: {
                    status: 'ERROR',
                    message: 'Patient id, track id and rating required',
                },
            });
        }

        const patient = await patientModel.findById(patientId);

        if (!patient) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'No patient by id ' + patientId },
            });
        }

        const track = await trackModel.findById(trackId);

        if (!track) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'No track by id ' + trackId },
            });
        }

        console.log('UPDATING RATING FOR SONG: ' + track.Title);
        console.log('RATING INPUT: ' + rating);

        // update the rating in the patient's trackRatings array. it should be the old rating + rating (change in rating)
        let oldRating = patient.trackRatings.find((trackRating) => trackRating.track == trackId).rating;
        console.log('OLD RATING: ' + oldRating);

        patient.trackRatings.find((trackRating) => trackRating.track == trackId).rating = oldRating + rating;
        await patient.save();

        console.log('NEW RATING: ' + patient.trackRatings.find((trackRating) => trackRating.track == trackId).rating);

        return JSON.stringify({
            statusCode: 200,
            body: { status: 'OK', message: 'Track rating updated successfully' },
        });
    } catch (err) {
        console.log(err);
        return JSON.stringify({
            statusCode: 500,
            body: { status: 'ERROR', message: 'Something went wrong' },
        });
    }
};

const getNextTrackId = async (event) => {
    try {
        const { patientId, prevTrackId } = JSON.parse(event.body);
        console.log(patientId);

        if (!patientId) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'Patient id required' },
            });
        }

        const patient = await patientModel.findById(patientId);
        const era = Math.floor((patient.birthdate.getTime() / (1000 * 60 * 60 * 24 * 365) + 18) / 10) * 10 + 1960;

        // Count how many tracks have a rating above 0
        let validTracks = patient.trackRatings.filter((trackRating) => trackRating.rating > 0);

        if (validTracks.length < 15) {
            console.log(15 - validTracks.length + ' TRACKS NEED TO BE ADDED');

            // Retrieve all tracks, ignoring era. Only tracks which are not in this patient's trackRatings array will be added
            const allTracks = await trackModel.find({
                Language: patient.language,
                Sample: true,
                _id: { $nin: patient.trackRatings },
            });
            const randomisedTracks = allTracks.sort(() => Math.random() - 0.5);

            // Sort by distance from the era
            const sortedTracks = randomisedTracks.sort((a, b) => Math.abs(a.Era - era) - Math.abs(b.Era - era));

            const newTracks = sortedTracks.slice(0, 15 - validTracks.length);

            // Add the new tracks to the patient's trackRatings array
            newTracks.forEach((track) => {
                patient.trackRatings.push({ track: track._id, rating: 3 });
            });
            await patient.save();
        }

        validTracks = patient.trackRatings.filter((trackRating) => trackRating.rating > 0);

        if (validTracks.length < 15) {
            // if still less than 15 tracks, don't need samples, just language
            const allTracks = await trackModel.find({
                Language: patient.language,
                _id: { $nin: patient.trackRatings },
            });
            const randomisedTracks = allTracks.sort(() => Math.random() - 0.5);
            const newTracks = randomisedTracks.slice(0, 15 - validTracks.length);

            // Add the new tracks to the patient's trackRatings array
            newTracks.forEach((track) => {
                patient.trackRatings.push({ track: track._id, rating: 3 });
            });
            await patient.save();
        }

        if (validTracks.length < 15) {
            // if still less than 15 tracks, get all samples from the era of any language
            const allTracks = await trackModel.find({
                Sample: true,
                _id: { $nin: patient.trackRatings },
            });
            const randomisedTracks = allTracks.sort(() => Math.random() - 0.5);
            const sortedTracks = randomisedTracks.sort((a, b) => Math.abs(a.Era - era) - Math.abs(b.Era - era));
            const randomisedTracks2 = sortedTracks.sort(() => Math.random() - 0.5);
            const newTracks = randomisedTracks2.slice(0, 15 - validTracks.length);

            // Add the new tracks to the patient's trackRatings array
            newTracks.forEach((track) => {
                patient.trackRatings.push({ track: track._id, rating: 3 });
            });
            await patient.save();
        }

        if (validTracks.length < 15) {
            // if still less than 15 tracks, get all tracks
            const allTracks = await trackModel.find({
                _id: { $nin: patient.trackRatings },
            });
            const randomisedTracks = allTracks.sort(() => Math.random() - 0.5);
            const newTracks = randomisedTracks.slice(0, 15 - validTracks.length);

            // Add the new tracks to the patient's trackRatings array
            newTracks.forEach((track) => {
                patient.trackRatings.push({ track: track._id, rating: 3 });
            });
            await patient.save();
        }

        const trackRatings = patient.trackRatings.reduce(
            (acc, { track, rating }) => ({
                ...acc,
                [track]:
                    acc[track] === -Infinity || rating < 0
                        ? -Infinity
                        : acc[track] !== undefined
                        ? acc[track] + rating
                        : rating,
            }),
            {},
        );

        // remove all tracks with a rating less than or equal to 0 from trackRatings
        // for (let track in trackRatings) {
        //     if (trackRatings[track] <= 0) {
        //         delete trackRatings[track];
        //     }
        // }

        const positiveTracks = Object.entries(trackRatings)
            .filter(([track, rating]) => rating > 0)
            .map(([track, rating]) => ({ track, rating }));

        const totalScore = positiveTracks.reduce((acc, { track, rating }) => acc + rating, 0);

        let trackObj;
        let trackSelectedId;
        let sameTrackCounter = 0;
        do {
            let diceRoll = Math.floor(Math.random() * totalScore);
            for (let i = 0; i < positiveTracks.length; i++) {
                let { track, rating } = positiveTracks[i];
                diceRoll -= rating;

                if (diceRoll <= 0 || i === positiveTracks.length - 1) {
                    trackObj = await trackModel.findById(track);
                    trackSelectedId = track;
                    break;
                }
            }

            if (prevTrackId !== -1 && trackSelectedId === prevTrackId) {
                console.log('Same track selected, rerolling');
                sameTrackCounter += 1;
            }
        } while (prevTrackId === trackSelectedId && sameTrackCounter < 5);

        // print rating of chosen track
        console.log('TRACK SELECTED: ' + trackObj.Title);
        console.log('RATING 1: ' + trackRatings[trackSelectedId]);
        console.log(
            'RATING 2: ' + patient.trackRatings.find((trackRating) => trackRating.track == trackSelectedId).rating,
        );

        return JSON.stringify({
            statusCode: 200,
            body: {
                track: trackObj,
                status: 'OK',
                message: 'Returning a random track weightings',
            },
        });
    } catch (err) {
        console.log(err);
        return JSON.stringify({
            statusCode: 500,
            body: { status: 'ERROR', message: 'Server error' },
        });
    }
};

const getNextTrackIdRandom = async (event) => {
    try {
        const patientId = JSON.parse(event.body);
        console.log(patientId.patientId);

        if (!patientId.patientId) {
            return JSON.stringify({ statusCode: 400, body: { status: 'ERROR', message: 'Patient id required' } });
        }

        const patient = await patientModel.findById(patientId.patientId);
        console.log(patient);

        if (patient.manualPlayset.length <= 5) {
            return JSON.stringify({
                statusCode: 500,
                body: { status: 'ERROR', message: 'songs' },
            });
        }

        const randomIndex = Math.floor(Math.random() * patient.manualPlayset.length);
        const trackObj = patient.manualPlayset[randomIndex];

        return JSON.stringify({
            statusCode: 200,
            body: {
                track: trackObj,
                status: 'OK',
                message: "Returning a random track from patient's manual playset",
            },
        });
    } catch (err) {
        console.log(err);
        return JSON.stringify({
            statusCode: 500,
            body: { status: 'ERROR', message: 'Server error' },
        });
    }
};

const getTitles = async (event) => {
    console.log(event);
    const json = event.queryStringParameters;
    const ids = json.ids.split(',');

    let titles = [];
    for (let i = 0; i < ids.length; i++) {
        const result = await trackModel.findOne({ _id: ids[i] });
        titles.push(result);
    }

    return JSON.stringify({
        statusCode: 200,
        body: { titles, status: 'OK', message: 'Found titles' },
    });
};

const isValidTrack = (track) => {
    if (track.duration > 1000 * 60 * 8) {
        // 8 minutes
        console.log('FILTERED TRACK: ' + track.name + ' BECAUSE OF DURATION');
        return false;
    }

    const negativeWords = [
        'mix',
        'mashup',
        'compilation',
        'medley',
        'best',
        'top',
        'mashup',
        'nonstop',
        'lofi',
        'hits',
        '100',
        '25',
        '20',
        '10',
        '5',
    ];

    // Filter by negative keywords
    for (let word of negativeWords) {
        if (track.name.toLowerCase().includes(word)) {
            console.log('FILTERED TRACK: ' + track.name + ' BECAUSE OF ' + word);
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
const loadInitialPlayset = async (event) => {
    const patientId = event.queryStringParameters.patientId;
    console.log(patientId);
    const patient = await patientModel.findById(patientId);
    const era = Math.floor((patient.birthdate.getTime() / (1000 * 60 * 60 * 24 * 365) + 18) / 10) * 10 + 1960;

    let tracks = await trackModel.find({
        Sample: true,
        Language: patient.language,
    }); // get all sample tracks for the language
    tracks = tracks.sort(() => Math.random() - 0.5); // shuffle the tracks
    tracks = tracks.sort((a, b) => Math.abs(a.Era - era) - Math.abs(b.Era - era)); // sort by distance from the era
    tracks = tracks.slice(0, 15);

    tracks.forEach((track) => {
        patient.trackRatings.push({ track: track._id, rating: 3 });
    });
    // console.log(patient.trackRatings)
    if (patient.trackRatings.length < 15) {
        // generate a function to check mongodb for all the tracks with the patient's language and get the first 15
        const allTracks = await trackModel.find({ Language: patient.language });
        const first15Tracks = allTracks.slice(0, 15);
        // iterate through first15Tracks and add them to the patient's trackRatings array
        first15Tracks.forEach((track) => {
            patient.trackRatings.push({ track: track._id, rating: 3 });
        });
        // console.log(patient.trackRatings)
    }
    await patient.save();

    return JSON.stringify({
        statusCode: 200,
        body: { status: 'OK', message: 'Found tracks for patient: ' + patientId },
    });
};

const manualYtQuery = async (event) => {
    try {
        // Thực hiện yêu cầu HTTP ở đây
        const query = JSON.parse(event.body.searchQuery);

        let response = await api.search(query, 'song');
        response.content = response.content.filter((track) => isValidTrack(track));

        const tracks = response.content.slice(0, 5);
        return JSON.stringify({
            statusCode: 200,
            body: { tracks: tracks },
        });
    } catch (error) {
        console.error(error);
    }
};

const uploadToS3 = (filePath, bucketName, contentType = 'audio/mpeg') => {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath);

        const params = {
            Bucket: bucketName,
            Key: path.basename(filePath),
            Body: fileContent,
            ContentType: contentType,
        };

        s3.upload(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
};

// Async function that serves the audio stream of a YouTube video given its URL
// Temporary audio files are saved in the temp folder
// Using ytdl to get the audio URL and ffmpeg to convert the audio format
// Frontend example can be found here: https://github.com/antoinekllee/youtube-audio-streamer/blob/main/App.js
const getTrackFromYt = async (videoUrl, patientId) => {
    return new Promise((resolve, reject) => {
        // Wrap function body in a promise
        try {
            const outputFilePath = path.join(__dirname, '../temp', `${patientId}_${Date.now()}.mp3`);

            // Create a writable stream to save the converted audio
            const writeStream = fs.createWriteStream(outputFilePath);

            const audioStream = ytdl(videoUrl, {
                quality: 'highestaudio',
                filter: (format) => format.container === 'webm' && !format.encoding,
            });

            // Use FFmpeg to convert the audio format
            ffmpeg(audioStream)
                .audioCodec('libmp3lame')
                .outputOptions(['-preset fast'])
                .format('mp3')
                .on('end', async () => {
                    try {
                        setTimeout(async () => {
                            const s3Url = await uploadToS3(outputFilePath, BUCKET_NAME);
                            fs.unlinkSync(outputFilePath); // Delete local file
                            resolve(s3Url); // Remember to resolve the promise here, not return
                        }, 1000); // delay for 1 second
                    } catch (error) {
                        console.error('Error during file upload:', error);
                        fs.unlinkSync(outputFilePath);
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    console.error('Error during audio conversion:', error);
                    fs.unlinkSync(outputFilePath);
                    reject(error);
                })
                .pipe(writeStream, { end: true });
        } catch (error) {
            console.error('Error fetching audio URL:', error);
            fs.unlinkSync(outputFilePath);
            reject(error);
        }
    });
};

const playTrack = async (event) => {
    try {
        const { track, patientId } = event.queryStringParameters;

        if (!track || !patientId) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'Track and patient id required' },
            });
        }

        // retrieve the track from the database
        const trackObj = await trackModel.findById(track);

        if (!trackObj) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'No track by id ' + track },
            });
        }

        if (!trackObj.URI || trackObj.URI === '') {
            let youtubeUrl = `https://www.youtube.com/watch?v=${trackObj.YtId}`;
            youtubeUrl = encodeURI(youtubeUrl);

            const s3Url = await getTrackFromYt(youtubeUrl, patientId);
            console.log(s3Url);
            trackObj.URI = s3Url;
            await trackObj.save();

            console.log('TRACK CONVERTED AND UPLOADED TO S3: ' + trackObj.Title);
            return JSON.stringify({
                statusCode: 200,
                body: {
                    audioURL: s3Url,
                    status: 'OK',
                    message: 'Track converted and uploaded to s3',
                },
            });
        } else {
            console.log('TRACK ALREADY IN S3: ' + trackObj.Title);
            return JSON.stringify({
                statusCode: 200,
                body: {
                    audioURL: trackObj.URI,
                    status: 'OK',
                    message: 'Track already in s3',
                },
            });
        }
    } catch (error) {
        console.error('Error playing track:', error);
        return JSON.stringify({
            statusCode: 500,
            body: { error: 'Error playing track' },
        });
    }
};

const searchTrack = async (event) => {
    const { title, pageNumber, pageSize = 10 } = JSON.parse(event.body);
    if (!title || !pageNumber) {
        return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
    }

    try {
        const skipCount = (pageNumber - 1) * pageSize;
        const tracks = await trackModel
            .find({ Title: { $regex: new RegExp(title, 'i') } })
            .skip(skipCount)
            .limit(pageSize)
            .exec();
        return JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get tracks by title ${title}`, tracks));
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error'));
    }
};

const getTracksByArtist = async (event) => {
    try {
        const { artist } = JSON.parse(event.body);
        if (!artist) {
            return JSON.stringify(ApiResponse.error(HttpStatus.BAD_REQUEST, 'Missing required fields'));
        }

        const playlist = await trackModel.find({ Artist: artist }).exec();
        return JSON.stringify(ApiResponse.success(HttpStatus.OK, `Get playlist by artist ${artist}`, playlist));
    } catch (error) {
        console.error(error);
        return JSON.stringify(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, 'Server Error'));
    }
};

module.exports = {
    getNextTrackId,
    getNextTrackIdRandom,
    playTrack,
    loadInitialPlayset,
    updateTrackRating,
    getTitles,
    manualYtQuery,
    searchTrack,
    getTracksByArtist,
};
