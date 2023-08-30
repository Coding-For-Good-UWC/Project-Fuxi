const express = require("express");
const controller = require("../../controllers/institute");
const requireAuth = require("../../middlewares/auth");

const router = express.Router();

router.post("/signup", controller.signup); // create new institute/user
router.post("/verify", requireAuth, controller.verify); // verify patient

router.get("/", requireAuth, controller.getInstitute);
router.get("/patients", requireAuth, controller.getPatients); // get all patients of institute
router.get("/namerepeat", controller.checkNameRepeat); // check if institute name is already taken

module.exports = router;
