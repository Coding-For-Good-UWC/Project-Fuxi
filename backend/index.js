require("dotenv").config();

const express = require('express');
const mongoose = require("mongoose"); 
const session = require('express-session');
const cors = require('cors');
const mongoStore = require("connect-mongo"); 
const path = require('path');

var admin = require("firebase-admin");

var serviceAccount = require("./.firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const routes = require ("./routes"); 

const { PORT=8080, SESSION_SECRET, MONGO_URI } = process.env; 

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors()); 
app.timeout = 120000; // Set the timeout to 2 minutes

app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: mongoStore.create({
        mongoUrl: MONGO_URI,
      }),
      cookie: { httpOnly: false, secure: false }
    })
  );

app.use('/temp', express.static(path.join(__dirname, 'temp'))); // Serve the temp folder for storing audio files from yt urls

app.use (routes); 

mongoose.set({strictQuery: false}); 
mongoose.connect(MONGO_URI); 

app.listen(PORT, () => 
{
    console.log(`REST API listening on port ${PORT}`);
});
