const instituteModel = require("../models/institute"); 
const patientModel = require("../models/patient");

const login = async (req, res) => 
{
    let { username, password } = req.body;

    const institute = await instituteModel.findOne({ username }); 

    if (!institute)
        return res.status(404).json({ status:"ERROR", message: "No institute with that username found" }); 
    
    if (institute.password !== password)
        return res.status(403).json({ status:"ERROR", message: "Password is incorrect" }); 

    // req.session.loggedIn = true;
    // req.session.caregiver = caregiver._id;

    // console.log ("LOGGED IN SUCCESSFULLY"); 
    // console.log (req.session); 
    // console.log ("----------------------"); 

    res.status(200).json({ institute, status:"OK", message: "Login successful" });
}

// Aysnc function to check if username already in use
const checkUsername = async (req, res) =>
{
    const { username } = req.body;

    const existingUsername = await instituteModel.findOne ({ username })

    if (existingUsername)
        return res.status (400).json ({ status: "ERROR", message: "Username already in use" }); 
    
    return res.status (200).json ({ status: "OK", message: "Username available" });
}

const signup = async (req, res) => 
{
    const { username, password } = req.body;

    console.log ("Sign up new user with username " + username + " and password " + password);

    if (!username || !password)
        return res.status(400).json({ status: "ERROR", message: "Missing required fields" });
    
    const newInstitute = await instituteModel.create({ username, password })

    // Remove password from institute object before sending it back to frontend
    newInstitute.password = undefined;

    res.status(200).json({ institute: newInstitute, status: "OK", message: "Institute created" }); 
}

const getPatients = async (req, res) => 
{
    try
    {
        const { instituteId } = req.params;
        
        if (!instituteId)
        return res.status(400).json({ status: "ERROR", message: "Institute ID is required" });
        
        const institute = await instituteModel.findById(instituteId);
        
        if (!institute)
        return res.status(404).json({ status: "ERROR", message: "Institute not found" });
        
        const patients = await patientModel.find({ institute: instituteId });
        
        console.log ("PATIENTS:")
        patients.forEach ((patient) => {
            console.log (patient.name);
        })
        res.status(200).json({ patients, status: "OK", message: "Patients retrieved successfully" });
    }
    catch (err)
    {
        console.log (err); 
        res.status(500).json({ status: "ERROR", message: "Server error" });
    }
}

module.exports = { login, checkUsername, signup, getPatients }; 