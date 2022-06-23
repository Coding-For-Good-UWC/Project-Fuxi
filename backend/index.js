require("dotenv").config();
const e = require("express");
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

function sanatize(input) {
    let escaped = ""
    if (typeof input === 'string' || input instanceof String){
        escaped = pool.escape(input);
    } else {
        escaped = pool.escape(input.toString());
    }
    return escaped.slice(1, -1);
}

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
    pool.query(query, [sanatize(req.params.username)], (error, results) => {
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
    pool.query(query, [sanatize(req.params.id)], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No user with that id found" });
        } else {
            res.json(results[0]);
        }
    });
});

// user: use login with username, password
// example: /v1/user/login
app.get(`/v${version}/user/login/`, async (req, res) => {
    let params = req.body;
    const query = `SELECT password_hash FROM ${database}.users WHERE username = ?`;
    pool.query(query, [sanatize(params.username)], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No user with that username found" });
        } else {
            if (results[0].password_hash == sanatize(params.password)) {
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
    pool.query(query, [sanatize(req.params.id)], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No song with that id found" });
        } else {
            res.json(results[0]);
        }
    });
});

// user_preferences: get user_preferences from user_id
// example: /v1/user_preferences/id/0/
app.get(`/v${version}/user_preferences/id/:user_id`, async (req, res) => {
    const query = `SELECT * FROM ${database}.user_preferences WHERE user_id = ?`;
    pool.query(query, [sanatize(req.params.user_id)], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "This user has no preferences yet" });
        } else {
            res.json(results[0]);
        }
    });
});

// user_preferences: insert record into user_preferences
// example: /v1/user_preferences/new
app.get(`/v${version}/user_preferences/new`, async (req, res) => {
    const data = {
        user_id: sanatize(req.body.user_id),
        song_id: sanatize(req.body.song_id),
        score: sanatize(req.body.score),
    };
    const query = `INSERT INTO ${database}.user_preferences(user_id, song_id, score) VALUES(?,?,?)`;
    pool.query(query, [data.user_id, data.song_id, data.score], (error) => {
        if (error) {
            res.json({
                error_message: `${error.code}: Inserting record failed!`,
            });
        } else {
            res.json({ data: data });
        }
    });
});

// user_preferences: updates record into user_preferences
// example: /v1/user_preferences/update
app.get(`/v${version}/user_preferences/update`, async (req, res) => {
    const data = {
        id: sanatize(req.body.id),
        score: sanatize(req.body.score),
    };
    const query = `UPDATE ${database}.user_preferences SET score= ? WHERE id= ?`;
    pool.query(query, [data.score, data.id], (error) => {
        if (error) {
            res.json({
                error_message: `${error.code}: Inserting record failed!`,
            });
        } else {
            res.json({ data: data });
        }
    });
});
