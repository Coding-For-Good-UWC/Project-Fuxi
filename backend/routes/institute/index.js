const express = require ("express"); 
const controller = require ("../../controllers/institute"); 

const router = express.Router (); 

router.get ("/", controller.getInstitute)
router.post ("/login", controller.login); 

module.exports = router; 