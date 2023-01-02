const express = require ("express"); 
const controller = require ("../../controllers/track"); 

const router = express.Router (); 

router.post ("/next", controller.getNextTrack); 

module.exports = router; 