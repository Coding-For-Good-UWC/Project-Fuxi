const { responseStatus } = require("../constants");
const instituteModel = require("../models/institute");
const patientModel = require("../models/patient");

const getPatients = async (req, res) => {
    const instituteId = req.uid;
    const institute = await instituteModel.findOne({ uid: instituteId });

    if (!institute)
        return res
            .status(404)
            .json({
                status: responseStatus.error,
                message: "Institute not found",
            });

    const patients = await patientModel.find({ institute: institute._id });

    res.status(200).json({
        patients,
        status: responseStatus.ok,
        message: "Patients retrieved successfully",
    });
};

const signup = async (req, res) => {
    const { uid, email, name } = req.body;
    if (!uid)
        return res.status(400).json({
            status: responseStatus.error,
            message: "Missing required fields",
        });

    const newInstitute = await instituteModel.create({ uid, email, name });

    res.status(200).json({
        status: responseStatus.ok,
        message: "Institute created",
        institute: newInstitute,
    });
};

const getInstitute = async (req, res) => {
    const instituteId = req.uid;
    const institute = await instituteModel.findOne({ uid: instituteId });

    if (!institute)
        return res
            .status(404)
            .json({
                status: responseStatus.error,
                message: "Institute not found",
            });

    res.status(200).json({
        institute,
        status: responseStatus.ok,
        message: "Institute retrieved successfully",
    });
};

const verify = async (req, res) => {
    res.status(200).json({
        status: responseStatus.ok,
        message: "Verified",
        uid: req.uid,
    });
};

const checkNameRepeat = async (req, res) => {
    const { name } = req.query; // Get the 'name' parameter from the query string instead of the request body
    const institute = await instituteModel.findOne({ name });
    if (institute == null) {
        return res
            .status(200)
            .json({ status: responseStatus.ok, message: "Name is unique" });
    } else {
        return res
            .status(400)
            .json({ status: responseStatus.error, message: "same" });
    }
};

module.exports = { signup, getPatients, verify, getInstitute, checkNameRepeat };
