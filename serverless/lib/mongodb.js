const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const filePath = path.join(__dirname, 'global-bundle.pem');

const options = {
    retryWrites: false,
    ssl: true,
    tlsAllowInvalidCertificates: true,
    tlsCAFile: filePath,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    directConnection: true,
};

let cachedDb = null;

const connectDb = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        cachedDb = await mongoose.connect(process.env.MONGO_URL, options);
        console.log('Connected to DocumentDB');
        return cachedDb;
    } catch (err) {
        console.error('Error connecting to DocumentDB:', err);
        throw err;
    }
};

const closeDb = async () => {
    if (cachedDb) {
        await cachedDb.disconnect();
        console.log('Disconnected from DocumentDB');
    }
};

module.exports = { connectDb, closeDb };
