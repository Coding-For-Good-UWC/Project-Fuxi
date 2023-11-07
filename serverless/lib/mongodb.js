const mongoose = require('mongoose');
let cachedDb = null;

const connectDb = async () => {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const dbUrl = process.env.MONGO_URL || '';
        cachedDb = await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DocumentDB');
        return cachedDb;
    } catch (err) {
        console.error('Error connecting to DocumentDB:', err);
        throw err;
    }
};

module.exports = { connectDb };
