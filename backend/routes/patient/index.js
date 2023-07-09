const express = require ("express"); 
const controller = require ("../../controllers/patient"); 

const router = express.Router (); 

router.post ("/new", controller.newPatient); // create new patient
router.put ("/manual", controller.editManualPlayset); // edit manual playset
router.put ("/manualyt", controller.editManualPlaysetYt); // edit manual playset youtube search
router.get ("/getmanual", controller.getManual); // get current manual playset

module.exports = router; 