const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = () => {
  const mongoUrl = process.env.MONGO_URL || '';
  mongoose.set({ strictQuery: false });
  mongoose.connect(mongoUrl).then(() => console.log('Mongo Connected....'));
};

module.exports.connectDb = connectDb;
