const patientModel = require("../models/patient"); 

const login = async (req, res) => 
{
    let { username, password } = req.body;

    const patient = await patientModel.findOne({ username }); 

    if (!patient)
        return res.status(404).json({ status:"ERROR", message: "No patient with that username found" }); 
    
    if (patient.password !== password)
        return res.status(403).json({ status:"ERROR", message: "Password is incorrect" }); 

    // req.session.loggedIn = true;
    // req.session.caregiver = caregiver._id;

    // console.log ("LOGGED IN SUCCESSFULLY"); 
    // console.log (req.session); 
    // console.log ("----------------------"); 

    res.status(200).json({ patient, status:"OK", message: "Login successful" });
}

// Aysnc function to check if username already in use
const checkUsername = async (req, res) =>
{
    const { username } = req.body;

    const existingUsername = await patientModel.findOne ({ username })

    if (existingUsername)
        return res.status (400).json ({ status: "ERROR", message: "Username already in use" }); 
    
    return res.status (200).json ({ status: "OK", message: "Username available" });
}

// { 
//     "username": "tPatient1",
//     "password": "secret",
//     "name": "Patient 1 Name", 
//     "age": "86", 
//     "ethnicity": "Chinese", 
//     "birthdate": "2022-01-01", 
//     "birthplace": "Singapore", 
//     "language": "English"
//   }
const signup = async (req, res) => 
{
    const { username, password, name, age, ethnicity, birthdate, birthplace, language, genres } = req.body;

    if (!username || !password || !name || !age || !ethnicity || !birthdate || !birthplace || !language)
        return res.status(400).json({ status: "ERROR", message: "Missing required fields" });
    
    const newPatient = await patientModel.create({ 
        username, 
        password, 
        name, 
        age,
        ethnicity, 
        birthdate,
        birthplace,
        language, 
        genres
    })

    // Remove password from patient object
    newPatient.password = undefined;

    res.status(200).json({ newPatient, status: "OK", message: "Patient created" }); 
}

const getPatient = async (req, res) => 
{
    const { id } = req.body; 

    if (!id)
        res.status(404).json({ message: "Patient id required" }); 

    const patient = await patientModel.findById(id); 

    if (!patient)
        res.status(404).json({ message: `Patient by id ${id} not found` }); 

    // Remove password from patient object
    patient.password = undefined;
    res.status(200).json(patient); 
}

module.exports = { login, checkUsername, signup, getPatient }; 