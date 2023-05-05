const express = require ("express"); 
const controller = require ("../../controllers/institute"); 

const router = express.Router (); 

router.post ("/login", controller.login); 
router.post ("/checkUsername", controller.checkUsername);
router.post ("/signup", controller.signup); // create new institute/user
router.get("/patients/:instituteId", controller.getPatients); // get all patients of institute

module.exports = router; 