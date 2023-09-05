const {
    Types: { ObjectId },
} = require("mongoose");

const seedPatientTracks = [
    {
        _id: ObjectId("64f70018c8b9d474ad8353a6"),
        name: "Test Patient 1",
        age: "82",
        ethnicity: "Indian",
        birthdate: "1962-05-02",
        birthplace: "India",
        language: "English",
        genres: ["Malay", "English", "Hindi"],
        instituteId: "64ec5e0c542846c7042ec06f",
    },
];

module.exports = {
    seedPatientTracks,
};
