const patientModel = require("../models/patient"); 

const getPatients = async(req, res) => 
{
    const patients = await patientModel.find({institute: req.session.institute}); 
    res.status(200).json({patients}); 
}

// { 
//     "name": "asdf", 
//     "age": "34", 
//     "ethnicity": "Chinese", 
//     "birthdate": "2022-01-01", 
//     "birthplace": "Singapore", 
//     "language": "English"
//   }
const newPatient = async (req, res) => 
{
    console.log (">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"); 
    console.log (req.session); 
    console.log (">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"); 

    const newPatient = await patientModel.create({ 
        ...req.body, 
        institute: req.session.institute
    })

    res.status(200).json(newPatient); 
}

const getPatient = async (req, res) => 
{
    const { id } = req.body; 

    if (!id)
        res.status(404).json({ message: "Patient id required" }); 

    const patient = await patientModel.findById(id); 

    if (!patient)
        res.status(404).json({ message: `Patient by id ${id} not found` }); 

    res.status(200).json(patient); 
}

module.exports = { getPatients, newPatient, getPatient }; 