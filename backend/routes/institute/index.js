const express = require ("express"); 
const controller = require ("../../controllers/institute"); 
const { getAuth } = require ("firebase-admin/auth");

const router = express.Router (); 

const verifyMw = async (req, res, next) => {
    const token = await getAuth().verifyIdToken(req.headers.token)
    
    req.uuid = token.uid;

    next();
}

router.get ("/", verifyMw, controller.getInstitute); 
router.post ("/login", controller.login); 
router.post ("/checkUsername", controller.checkUsername);
router.post ("/signup", controller.signup); // create new institute/user
router.get("/patients", verifyMw, controller.getPatients); // get all patients of institute
router.post("/verify", verifyMw, controller.verify); // verify patient

module.exports = router; 