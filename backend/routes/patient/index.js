const express = require ("express"); 
const controller = require ("../../controllers/patient"); 

const router = express.Router (); 

// router.get ("/patients", controller.getPatients); // get all patients under currently logged in caregiver

router.post ("/", controller.getPatient) // get specific patient by id
router.post ("/login", controller.login); 
router.post ("/checkUsername", controller.checkUsername);
router.post ("/signup", controller.signup); // create new patient
// router.post ("/getPatients", controller.getPatients); 

module.exports = router; 