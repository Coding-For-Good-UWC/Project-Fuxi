const express = require ("express"); 
const controller = require ("../../controllers/patient"); 

const router = express.Router (); 

router.post ("/new", controller.newPatient); // create new patient
router.put ("/manual", controller.editManualPlayset); // edit manual playset
router.put ("/manualyt", controller.editManualPlaysetYt); // create new patient

module.exports = router; 