const express = require ("express"); 
const controller = require ("../../controllers/patient"); 

const router = express.Router (); 

router.get ("/patients", controller.getPatients); // get all patients under currently logged in institute
router.post ("/new", controller.newPatient); // create new patient
router.post ("/getPatient", controller.getPatient) // get specific patient by id

module.exports = router; 