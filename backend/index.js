require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require('sexpress-session');
const cors = require("cors");
const mongoStore = require("connect-mongo");
const path = require("path");
const admin = require("firebase-admin");

const {
    FIREBASE_PRIVATE_KEY_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_CLIENT_ID,
    FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    FIREBASE_CLIENT_X509_CERT_URL,
    NODE_ENV,
    PORT = 8080,
    SESSION_SECRET,
    MONGO_URI,
} = process.env;

var serviceAccount = {
    type: "service_account",
    project_id: "project-fuxi-6edd2",
    private_key_id: FIREBASE_PRIVATE_KEY_ID,
    private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: FIREBASE_CLIENT_EMAIL,
    client_id: FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const routes = require("./routes");
const errorHandling = require("./middlewares/errorHanling");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.timeout = 120000; // Set the timeout to 2 minutes

const mongoUrl =
    NODE_ENV === "test"
        ? `${globalThis.__MONGO_URI__}${globalThis.__MONGO_DB_NAME__}`
        : MONGO_URI;

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: mongoStore.create({
            mongoUrl,
        }),
        cookie: { httpOnly: false, secure: false },
    })
);

app.use("/temp", express.static(path.join(__dirname, "temp"))); // Serve the temp folder for storing audio files from yt urls

app.use(routes);

app.use(errorHandling);

mongoose.set({ strictQuery: false });
mongoose.connect(mongoUrl);

const server = app.listen(PORT, () => {
    console.log(`REST API listening on port ${PORT}`);
});

module.exports = { server, app };
