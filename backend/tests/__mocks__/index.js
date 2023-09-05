const mongoose = require("mongoose");
const instituteModel = require("../../models/institute");
const trackModel = require("../../models/track");
const { seedInstitutes } = require("./institute.mock");
const { seedTracks } = require("./track.mock");

const seedData = async () => {
    await instituteModel.insertMany(seedInstitutes);
    await trackModel.insertMany(seedTracks);
};

const prepareMongoose = () => {
    beforeAll(async () => {
        mongoose.set({ strictQuery: false });
        await mongoose.connect(
            `${globalThis.__MONGO_URI__}${globalThis.__MONGO_DB_NAME__}`
        );

        await seedData();
    });

    afterAll(async () => {
        mongoose.connection.close();
    });
};

module.exports = {
    seedData,
    prepareMongoose,
};
