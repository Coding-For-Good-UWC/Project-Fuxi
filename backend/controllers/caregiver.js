const caregiverModel = require("../models/caregiver"); 

const login = async (req, res) => 
{
    let { username, password } = req.body;

    const caregiver = await caregiverModel.findOne({ username }); 

    if (!caregiver)
        return res.status(404).json({ error_message: "No user with that username found" }); 
    
    if (caregiver.password !== password)
        return res.status(403).json({ error_message: "Password is incorrect" }); 

    // req.session.loggedIn = true;
    // req.session.caregiver = caregiver._id;

    // console.log ("LOGGED IN SUCCESSFULLY"); 
    // console.log (req.session); 
    // console.log ("----------------------"); 

    res.status(200).json({ caregiver, status:"ok" });
}

const getCaregiver = async(req, res) => 
{
    console.log ("CALLED GET CAREGIVER"); 
    console.log (req.session); 
    console.log ("----------------------"); 

    const { caregiver: caregiverId } = req.session; // get caregiver id from session

    if (!caregiverId)
        return res.sendStatus(403); 

    const caregiver = await caregiverModel.findById(caregiverId); 
    
    if (!caregiver)
        return res.sendStatus(404); 
    
    res.status(200).json(caregiver); 
}

module.exports = { login, getCaregiver }; 