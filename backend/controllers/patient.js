const patientModel = require("../models/patient");
const ObjectId = require('mongoose').Types.ObjectId;
const trackModel = require("../models/track"); 
const MongoClient = require('mongodb').MongoClient;
// const database = client.db('Project_Fuxi');
// const users = database.collection('patients');

// {
// 	"name": "Test Patient 1",
// 	"age": "82",
// 	"ethnicity": "Indian",
// 	"birthdate": "1962-05-02",
// 	"birthplace": "India",
// 	"language": "English",
// 	"genres": [
// 		"Malay",
// 		"English",
// 		"Hindi"
// 	],
// 	"instituteId": "6453bad42722ccbd7af96079"
// }
const newPatient = async (req, res) => {
    try {
        // TODO: GET INSTITUTE ID FROM SESSION WHEN FIXED, UNSAFE TO PASS THROUGH FRONTEND
        const {
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
            genres,
            instituteId,
        } = req.body;

        if (
            !name ||
            !age ||
            !ethnicity ||
            !birthdate ||
            !birthplace ||
            !language ||
            !genres ||
            !instituteId
        )
            return res
                .status(400)
                .json({ status: "ERROR", message: "help required fields" });

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

        // Remove password from patient object
        newPatient.password = undefined;

        res.status(200).json({
            patient: newPatient,
            status: "OK",
            message: "Patient created",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "ERROR",
            message: "Internal server error",
        });
    }
};

const editManualPlayset = async (req, res) => {
  const { array, patientID } = req.body;
  const query = { _id: ObjectId(patientID) };

  // Fetch the existing manualPlayset array for the patient
  const existingPatient = await patientModel.findOne(query);
  const existingManualPlayset = existingPatient.manualPlayset || [];

  // Filter out duplicate items from the incoming array and keep track of them
  const duplicates = [];
  const filteredArray = array.filter((item) => {
    const isAlreadyAdded = existingManualPlayset.some(
      (existingItem) => existingItem.id === item.id
    );
    if (isAlreadyAdded) {
      duplicates.push(item);
    }
    return !isAlreadyAdded;
  });

  // If no new items to add, return a response
  if (filteredArray.length === 0) {
    return res.status(200).json({
      status: "OK",
      message: "repeats",
      existingValues: duplicates
    });
  }

  const update = { $push: { manualPlayset: { $each: filteredArray } } };

  try {
    await patientModel.updateOne(query, update);
    return res
      .status(200)
      .json({ status: "OK", message: "Updated to the database successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};





const editManualPlaysetYt = async (req, res) => {
  const vals = req.body.array[0].item;
  const patientinfo = req.body.patientInfo;
  const query = { _id: ObjectId(patientinfo._id) };

  let doc = await trackModel.create({
    Title: vals['name'],
    URI: vals['videoId'],
    Artist: vals['artist'].name,
    Language: patientinfo.language,
    Genre: patientinfo.genres[0],
    ImageURL: vals.thumbnails[0].url
  })
  
  const playsetUpdate = { id: vals['videoId'], rating: 3, name: vals['name']};

  // Check if the value already exists in the manualPlayset array
  const isAlreadyAdded = patientinfo.manualPlayset.some(item => item.id === playsetUpdate.id);

  if (!isAlreadyAdded) {
    const update = { $push: { manualPlayset: playsetUpdate } };
    // ADD TO PERSON'S MANUAL PLAYSET
    try {
      await patientModel.updateOne(query, update);
      return res.status(200).json({ status: "OK", message: "Updated to the database successfully" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "ERROR",
        message: "Internal server error",
      });
    }
  } else {
    // Get the existing values
    const existingValues = patientinfo.manualPlayset.filter(item => item.id === playsetUpdate.id);
    return res.status(200).json({ status: "OK", message: "repeats", existingValues: existingValues });
  }
}

        

        const getManual = async (req, res) => {
          const patientid = req.query
          console.log(patientid)
          try{
            const query = { _id: ObjectId(patientid) };
            const patient = await patientModel.findOne(query);
            console.log(patient.manualPlayset)
            return res.status(200).json(patient.manualPlayset);
          }
          catch(error){

          }
      
              }  



module.exports = { newPatient,editManualPlayset, editManualPlaysetYt, getManual};
