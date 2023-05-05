const express = require ("express"); 
const controller = require ("../../controllers/institute"); 
const { getAuth } = require ("firebase-admin/auth");

const router = express.Router (); 

const verifyMw = async (req, res, next) => {
    const token = await getAuth().verifyIdToken(req.headers.token)
    
    req.uid = token.uid;

    next();
}

router.post ("/signup", controller.signup); // create new institute/user
router.post("/verify", verifyMw, controller.verify); // verify patient

router.get ("/", verifyMw, controller.getInstitute); 
router.get("/patients", verifyMw, controller.getPatients); // get all patients of institute

module.exports = router; 