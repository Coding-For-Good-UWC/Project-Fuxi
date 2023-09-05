const patientModel = require("../models/patient");
const ObjectId = require('mongoose').Types.ObjectId;
const trackModel = require("../models/track"); 
const MongoClient = require('mongodb').MongoClient;
let trackid;
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
        delete newPatient.password

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
  console.log(array)
  // Fetch the existing manualPlayset array for the patient
  const existingPatient = await patientModel.findOne(query);
  const existingManualPlayset = existingPatient.manualPlayset || [];

  // Filter out duplicate items from the incoming array and keep track of them
  const duplicates = [];
  const filteredArray = array.filter((item) => {
    const isAlreadyAdded = existingManualPlayset.some(
      (existingItem) => existingItem.trackid === item.trackid
    );
    if (isAlreadyAdded) {
      duplicates.push(item);
    }
    return !isAlreadyAdded;
  });

  // // If no new items to add, return a response
  // if (filteredArray.length === 0) {
  //   return res.status(200).json({
  //     status: "OK",
  //     message: "repeats",
  //     existingValues: duplicates
  //   });
  // }
  
  const update = { $push: { manualPlayset: { $each: filteredArray } } };
  console.log("filtered array")
console.log(filteredArray)
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
  const item = req.body.array[0]?.item;  // Access item 
  const patientinfo = req.body.patientInfo;
  const query = { _id: ObjectId(patientinfo._id) };
  let doc;
  let track;
  

  try {
    console.log("goin in")
    doc = await trackModel.create({
      Title: item['name'],
      YtId: item['videoId'],
      Artist: item['artist'].name,
      Language: patientinfo.language,
      Genre: patientinfo.genres[0],
      ImageURL: item.thumbnails[0].url
    });
    
    track = doc;
    console.log("track")
    console.log(track)
  } catch (err) {
    if (err.code === 11000) {
      track = await trackModel.findOne({YtId:item['videoId']});
    } else {
      return res.status(500).json({ status: "ERROR", message: "Internal server error" });
    }
  }

  console.log("Track ID:", track);  //Print track ID

  const playsetUpdate = { id:"", trackid:track._id.toString()};
  const trackratingsUpdate = { track: ObjectId(track._id.toString()), rating: 3};

  // Check if the value already exists in the manualPlayset array
  const isAlreadyAdded = patientinfo.manualPlayset.some(item => item.trackid === playsetUpdate.trackid);

  if (!isAlreadyAdded) {
    const update = { $push: { manualPlayset: playsetUpdate } };
    const updatetrackratings = { $push: { trackRatings: trackratingsUpdate } };
    // ADD TO PERSON'S MANUAL PLAYSET
    try {
      await patientModel.updateOne(query, update);
      await patientModel.updateOne(query,updatetrackratings)
      return res.status(200).json({ status: "OK", message: "Updated to the database successfully" });
    } catch (err) {
      console.log(err);
      if(err)
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
};



const deletefromManual = async(req,res)=>{
  console.log("IN DELETE")
  const id_to_delete = ObjectId(req.body.trackid); // Convert id_to_delete to ObjectId
  const patientid = req.body.patientid
  const patient = await patientModel.findOne({_id: patientid});
  console.log(patientid,id_to_delete)

  if (!patient) {
    // Handle case where patient is not found
    return res.status(404).send('Patient not found');
  }

  // Filter out the item with the id_to_delete
  patient.manualPlayset = patient.manualPlayset.filter(item => !item.trackid.equals(id_to_delete));
  console.log("item deleted")
  console.log(patient.manualPlayset)
  // Save the updated patient
  await patient.save();

  // Send a response
  res.status(200).send('Item deleted from manual playset');
}

        
const getManual = async (req, res) => {
  const patientid = req.query;
  console.log(patientid);

  try{
      const query = { _id: ObjectId(patientid) };
      const patient = await patientModel.findOne(query);

      if (!patient || !patient.manualPlayset) {
          return res.status(404).json({ message: 'Patient or Manual Playset not found' });
      }



      let trackModelArray = [];

      for (let i = 0; i < patient.manualPlayset.length; i++) {
          const trackId = patient.manualPlayset[i].trackid;
          console.log(trackId)
          const track = await trackModel.findOne({ _id: trackId });

          if (track) {
              trackModelArray.push(track);
          }
      }
      console.log(trackModelArray);
      return res.status(200).json(trackModelArray);
  }
  catch(error){
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
}




module.exports = { newPatient,editManualPlayset, editManualPlaysetYt, getManual, deletefromManual};
