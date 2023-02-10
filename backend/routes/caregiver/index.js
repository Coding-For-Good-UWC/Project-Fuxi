const express = require ("express"); 
const controller = require ("../../controllers/caregiver"); 

const router = express.Router (); 

router.get ("/", controller.getCaregiver)
router.post ("/login", controller.login); 

module.exports = router; 