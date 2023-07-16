const express = require ("express"); 
const controller = require ("../../controllers/track"); 

const router = express.Router (); 

router.post ("/next", controller.getNextTrackId); 
router.post ("/nextrandom", controller.getNextTrackIdRandom); 
router.post ("/get", controller.getTrack); 
router.get ("/titles", controller.getTitles); 
router.post ("/scrape", controller.scrapeTracks);
router.post ("/scrapeyt", controller.scrapeYtTrack);
router.post('/audio-url', controller.playTrack);
router.post ("/rating", controller.updateTrackRating);
router.post ("/clean", controller.cleanTempFolder)
module.exports = router; 
