const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
let cachedDb = null;

const filePath = path.join(__dirname, 'global-bundle.pem');

const tlsCA = fs.readFileSync(filePath);

const connectDb = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const dbUrl = process.env.MONGO_URL || '';
        cachedDb = await mongoose.connect(dbUrl, {
            tlsCAFile: tlsCA,
        });
        console.log('Connected to DocumentDB');
        return cachedDb;
    } catch (err) {
        console.error('Error connecting to DocumentDB:', err);
        throw err;
    }
};

module.exports = { connectDb };
