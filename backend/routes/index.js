const express = require ("express"); 

// const caregiverRoutes = require ("./caregiver"); 
const patientRoutes = require ("./patient"); 
const trackRoutes = require ("./track"); 

const router = express.Router (); 

// router.use ("/caregiver", caregiverRoutes); 
router.use ("/patient", patientRoutes); 
router.use ("/track", trackRoutes); 

module.exports = router; 