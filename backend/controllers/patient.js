const patientModel = require("../models/patient");

// {
// 	"name": "Test Patient 1",
// 	"age": "82",
// 	"ethnicity": "Indian",
// 	"birthdate": "1962-05-02",
// 	"birthplace": "India",
// 	"language": "English",
// 	"genres": [
// 		"Malay",
// 		"English",
// 		"Hindi"
// 	],
// 	"instituteId": "6453bad42722ccbd7af96079"
// }
const newPatient = async (req, res) => {
    try {
        // TODO: GET INSTITUTE ID FROM SESSION WHEN FIXED, UNSAFE TO PASS THROUGH FRONTEND
        const {
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
            genres,
            instituteId,
        } = req.body;

        if (
            !name ||
            !age ||
            !ethnicity ||
            !birthdate ||
            !birthplace ||
            !language ||
            !genres ||
            !instituteId
        )
            return res
                .status(400)
                .json({ status: "ERROR", message: "Missing required fields" });

        console.log("Patient data:", {
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
            genres,
            instituteId,
        });

        const newPatient = await patientModel.create({
            name,
            age,
            ethnicity,
            birthdate,
            birthplace,
            language,
            genres,
            institute: instituteId,
        });

        // Remove password from patient object
        newPatient.password = undefined;

        res.status(200).json({
            patient: newPatient,
            status: "OK",
            message: "Patient created",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "ERROR",
            message: "Internal server error",
        });
    }
};

module.exports = { newPatient };
