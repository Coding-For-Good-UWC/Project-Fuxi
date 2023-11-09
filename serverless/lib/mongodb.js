const path = require('path');
const mongoose = require('mongoose');

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
        cachedDb = await mongoose.connect(
            'mongodb://zany:EXm7B3b9uRwc8D2pK@fuxi-app.cluster-cw2bftuqzp8d.ap-southeast-1.docdb.amazonaws.com:27017/Project_FUXI',
            options,
        );
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
