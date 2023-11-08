const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
let cachedDb = null;

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

const connectDb = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const dbUrl = process.env.MONGO_URL || '';
        cachedDb = await mongoose.connect('mongodb://zany:EXm7B3b9uRwc8D2pK@localhost:27117/Project_FUXI', options);
        console.log('Connected to DocumentDB');
        return cachedDb;
    } catch (err) {
        console.error('Error connecting to DocumentDB:', err);
        throw err;
    }
};

module.exports = { connectDb };
