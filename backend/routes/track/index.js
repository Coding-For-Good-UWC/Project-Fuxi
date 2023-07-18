const express = require ("express"); 
const controller = require ("../../controllers/track"); 

const router = express.Router (); 

router.post ("/next", controller.getNextTrackId); 
router.post ("/nextrandom", controller.getNextTrackIdRandom); 
router.get ("/titles", controller.getTitles); 
router.post ("/initial", controller.loadInitialPlayset);
router.post ("/ytQuery", controller.manualYtQuery);
router.post('/audio-url', controller.playTrack);
router.post ("/rating", controller.updateTrackRating);
module.exports = router; 
