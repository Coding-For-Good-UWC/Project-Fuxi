const mongoose = require("mongoose");

const connectDb = () => {
  const mongoUrl = "mongodb+srv://Antoine:OoNsBwcb4Gi0cKmQ@cluster0.h9uq5il.mongodb.net/Project_FUXI?retryWrites=true&w=majority"
  mongoose.set({ strictQuery: false });
  mongoose.connect(mongoUrl);
};

module.exports.connectDb = connectDb;
