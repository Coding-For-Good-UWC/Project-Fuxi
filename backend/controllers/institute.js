const instituteModel = require("../models/institute"); 
const patientModel = require("../models/patient");

const getPatients = async (req, res) => 
{
    try
    {
        const instituteId = req.uid;
        
        if (!instituteId)
            return res.status(400).json({ status: "ERROR", message: "Institute ID is required" });
        
        const institute = await instituteModel.findOne({ uid: instituteId });
        
        if (!institute)
        return res.status(404).json({ status: "ERROR", message: "Institute not found" });
        
        const patients = await patientModel.find({ institute: institute._id });
        
        res.status(200).json({ patients, status: "OK", message: "Patients retrieved successfully" });
    }
    catch (err)
    {
        console.log (err); 
        res.status(500).json({ status: "ERROR", message: "Server error" });
    }
}

const signup = async (req, res) =>
{
    try
    {
        const { uid, email, name } = req.body;
        if (!uid)
            return res.status(400).json({ status: "ERROR", message: "Missing required fields" });

        const existingInstitute = await instituteModel.findOne({ $or: [{ email }, { name }] });
        if (existingInstitute)
            return res.status(400).json({ status: "ERROR", message: "Institute already exists" });

        const newInstitute = await instituteModel.create({ uid, email, name }); 

        res.status(200).json({ status: "OK", message: "Institute created", institute: newInstitute }); 
    }
    catch (err)
    {
        console.log (err); 
        res.status(500).json({ status: "ERROR", message: "Server error" });
    }
}

const getInstitute = async (req, res) => 
{
    const instituteId = req.uid;
    
    if (!instituteId)
        return res.status(400).json({ status: "ERROR", message: "Institute ID is required" });
        
    const institute = await instituteModel.findOne({ uid: instituteId });
    
    if (!institute)
        return res.status(404).json({ status: "ERROR", message: "Institute not found" });

    res.status(200).json({ institute, status: "OK", message: "Institute retrieved successfully" });
}

const verify = async(req, res) => 
{
    res.status(200).json({ status: "OK", message: "Verified", uid: req.uid });
}

module.exports = { signup, getPatients, verify, getInstitute }; 