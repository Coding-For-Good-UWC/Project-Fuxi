const express = require ("express"); 
const controller = require ("../../controllers/patient"); 

const router = express.Router (); 

router.post ("/new", controller.newPatient); // create new patient

module.exports = router; 