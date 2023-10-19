require('aws-sdk/lib/maintenance_mode_message').suppress = true;
const ObjectId = require('mongoose').Types.ObjectId;
const { connectDb } = require('../lib/mongodb');
const patientModel = require('../models/patient');
const trackModel = require('../models/track');

connectDb();

const newPatient = async (event) => {
    try {
        const { name, age, ethnicity, birthdate, birthplace, language, genres, instituteId, password } = JSON.parse(event.body);
        console.log(name);

        if (!name || !age || !ethnicity || !birthdate || !birthplace || !language || !genres || !instituteId || !password) {
            return JSON.stringify({
                statusCode: 400,
                body: { status: 'ERROR', message: 'help required fields' },
            });
        }

        const newPatient = await patientModel.create({
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
            genres,
            institute: instituteId,
        });

        return JSON.stringify({
            statusCode: 200,
            body: { patient: newPatient, status: 'OK', message: 'Patient created' },
        });
    } catch (err) {
        console.log(err);
        return JSON.stringify({
            statusCode: 500,
            body: {
                status: 'ERROR',
                message: 'Internal server error',
            },
        });
    }
};

const editManualPlayset = async (event) => {
    const { array, patientID } = JSON.parse(event.body);
    const query = { _id: ObjectId(patientID) };
    // Fetch the existing manualPlayset array for the patient
    const existingPatient = await patientModel.findOne(query);
    const existingManualPlayset = existingPatient.manualPlayset || [];

    // Filter out duplicate items from the incoming array and keep track of them
    const duplicates = [];
    const filteredArray = array.filter((item) => {
        const isAlreadyAdded = existingManualPlayset.some((existingItem) => existingItem.trackid === item.trackid);
        if (isAlreadyAdded) {
            duplicates.push(item);
        }
        return !isAlreadyAdded;
    });

    const update = { $push: { manualPlayset: { $each: filteredArray } } };

    try {
        await patientModel.updateOne(query, update);
        return JSON.stringify({
            statusCode: 200,
            body: { status: 'OK', message: 'Updated to the database successfully' },
        });
    } catch (err) {
        console.log(err);
        return JSON.stringify({
            statusCode: 500,
            body: {
                status: 'ERROR',
                message: 'Internal server error',
            },
        });
    }
};

const editManualPlaysetYt = async (event) => {
    const { array } = JSON.parse(event.body); // Access item
    const arrayItem = array[0].item;
    const { patientInfo } = JSON.parse(event.body);
    const query = { _id: ObjectId(patientInfo._id) };
    let doc;
    let track;

    try {
        doc = await trackModel.create({
            Title: arrayItem.name,
            YtId: arrayItem.videoId,
            Artist: arrayItem.artist.name,
            Language: patientInfo.language,
            Genre: patientInfo.genres[0],
            ImageURL: arrayItem.thumbnails[0].url,
        });

        track = doc;
        console.log('track');
        console.log(track);
    } catch (err) {
        if (err.code === 11000) {
            track = await trackModel.findOne({ YtId: arrayItem['videoId'] });
        } else {
            return JSON.stringify({
                statusCode: 500,
                body: { status: 'ERROR', message: 'Internal server error' },
            });
        }
    }
    console.log('Track ID:', track); //Print track ID

    const playsetUpdate = { id: '', trackid: track._id.toString() };
    const trackratingsUpdate = {
        track: ObjectId(track._id.toString()),
        rating: 3,
    };

    // Check if the value already exists in the manualPlayset array
    const isAlreadyAdded = patientInfo.manualPlayset.some((item) => item.trackid === playsetUpdate.trackid);

    if (!isAlreadyAdded) {
        const update = { $push: { manualPlayset: playsetUpdate } };
        const updatetrackratings = { $push: { trackRatings: trackratingsUpdate } };
        // ADD TO PERSON'S MANUAL PLAYSET
        try {
            await patientModel.updateOne(query, update);
            await patientModel.updateOne(query, updatetrackratings);

            return JSON.stringify({
                statusCode: 200,
                body: {
                    status: 'OK',
                    message: 'Updated to the database successfully',
                },
            });
        } catch (err) {
            return JSON.stringify({
                statusCode: 500,
                body: {
                    status: 'ERROR',
                    message: 'Internal server error',
                },
            });
        }
    } else {
        // Get the existing values
        const existingValues = patientInfo.manualPlayset.filter((item) => item.id === playsetUpdate.id);
        return JSON.stringify({
            statusCode: 200,
            body: {
                status: 'OK',
                message: 'repeats',
                existingValues: existingValues,
            },
        });
    }
};

const deletefromManual = async (event) => {
    const json = JSON.parse(event.body);
    const id_to_delete = ObjectId(json.trackid); // Convert id_to_delete to ObjectI)d
    const patientid = json.patientid;
    const patient = await patientModel.findOne({ _id: patientid });

    if (!patient) {
        return JSON.stringify({
            statusCode: 400,
            body: 'Patient not found',
        });
    }

    // Filter out the item with the id_to_delete
    patient.manualPlayset = patient.manualPlayset.filter((item) => !item.trackid.equals(id_to_delete));
    // Save the updated patient
    await patient.save();

    // Send a response
    return JSON.stringify({
        statusCode: 200,
        body: 'Item deleted from manual playset',
    });
};

const getManual = async (event) => {
    const { patientid } = event.queryStringParameters;
    console.log(patientid);

    try {
        const query = { _id: ObjectId(patientid) };
        const patient = await patientModel.findOne(query);

        if (!patient || !patient.manualPlayset) {
            return JSON.stringify({
                statusCode: 400,
                body: { message: 'Patient or Manual Playset not found' },
            });
        }

        let trackModelArray = [];

        for (let i = 0; i < patient.manualPlayset.length; i++) {
            const trackId = patient.manualPlayset[i].trackid;
            console.log(trackId);
            const track = await trackModel.findOne({ _id: trackId });

            if (track) {
                trackModelArray.push(track);
            }
        }
        console.log(trackModelArray);
        return JSON.stringify({
            statusCode: 200,
            body: trackModelArray,
        });
    } catch (error) {
        console.error(error);
        return JSON.stringify({
            statusCode: 500,
            body: { message: 'Internal Server Error' },
        });
    }
};

module.exports = {
    newPatient,
    editManualPlayset,
    editManualPlaysetYt,
    getManual,
    deletefromManual,
};