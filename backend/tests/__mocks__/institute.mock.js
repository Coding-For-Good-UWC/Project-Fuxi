const {
    Types: { ObjectId },
} = require("mongoose");

const seedInstitutes = [
    {
        _id: ObjectId("64ec5e0c542846c7042ec06f"),
        uid: "a7ef6a22-457e-11ee-be56-0242ac120002",
        name: "mock1",
        email: "mock1@gmail.com",
    },
];

module.exports = {
    seedInstitutes,
};
