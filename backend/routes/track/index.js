const express = require ("express"); 
const controller = require ("../../controllers/track"); 

const router = express.Router (); 

router.post ("/next", controller.getNextTrackId); 
router.post ("/get", controller.getTrack); 

module.exports = router; 