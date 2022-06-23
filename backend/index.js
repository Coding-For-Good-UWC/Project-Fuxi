require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const app = express();
app.use(express.json());

const port = process.env.PORT || 8080;
const version = process.env.VERSION || 1;
const hostname = process.env.HOST_NAME;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

let pool = mysql.createPool({
    connectionLimit: 100,
    host: hostname,
    user: username,
    port: 3306,
    password: password,
    database: database,
});

// user_preferences
// - get score from song_id (user_id)
// - create new record

app.listen(port, () => {
    console.log(`REST API listening on port ${port}`);
});

app.get(`/v${version}/`, async (req, res) => {
    res.json({ error_message: "Request recieved" });
});

// user: read user_id from username
// example: /v1/user/id/johndoe0
app.get(`/v${version}/user/id/:username`, async (req, res) => {
    const query = `SELECT * FROM ${database}.users WHERE username = ?`;
    pool.query(query, [req.params.username], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No id with that username found" });
        } else {
            res.json({ id: results[0].id });
        }
    });
});

// user: get user information from user_id
// example: /v1/user/info/0
app.get(`/v${version}/user/info/:id`, async (req, res) => {
    const query = `SELECT * FROM ${database}.users WHERE id = ?`;
    pool.query(query, [req.params.id], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No user with that id found" });
        } else {
            res.json(results[0]);
        }
    });
});

// user: use login with username, password
// example: /v1/user/login
app.get(`/v${version}/user/info/`, async (req, res) => {
    let params = req.body;
    const query = `SELECT password_hash FROM ${database}.users WHERE username = ?`;
    pool.query(query, [pool.escape(params.username)], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No user with that username found" });
        } else {
            if (results[0].password_hash == params.password) {
                res.send({ token: "jwttokenorsmth" }); //TODO: ASK ADI
            } else {
                res.json({ error_message: "Password is invalid" });
            }
        }
    });
});

// songs: read song information from song_id
// example: /v1/song/info/0
app.get(`/v${version}/song/info/:id`, async (req, res) => {
    const query = `SELECT * FROM ${database}.songs WHERE id = ?`;
    pool.query(query, [req.params.id], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No song with that id found" });
        } else {
            res.json(results[0]);
        }
    });
});

// user_preferences: get user_preferences from user_id
// example: /v1/user_preferences/0/
app.get(`/v${version}/user_preferences/:user_id`, async (req, res) => {
    const query = `SELECT * FROM ${database}.user_preferences WHERE user_id = ?`;
    pool.query(query, [req.params.id], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "This user has no preferences yet" });
        } else {
            res.json(results[0]);
        }
    });
});