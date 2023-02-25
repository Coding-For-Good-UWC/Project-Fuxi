const express = require ("express"); 
const controller = require ("../../controllers/patient"); 

const router = express.Router (); 

router.post ("/", controller.getPatient) // get specific patient by id

router.post ("/login", controller.login); 

router.post ("/checkUsername", controller.checkUsername);
router.post ("/signup", controller.signup); // create new patient

module.exports = router; 