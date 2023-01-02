const express = require ("express"); 

const instituteRoutes = require ("./institute"); 
const patientRoutes = require ("./patient"); 
const trackRoutes = require ("./track"); 

const router = express.Router (); 

router.use ("/institute", instituteRoutes); 
router.use ("/patient", patientRoutes); 
router.use ("/track", trackRoutes); 

module.exports = router; 