require("dotenv").config();
const express = require('express');
const sha256 = require('js-sha256');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

var corsOptions = {
  origin: "http://localhost:8081",
  credentials:  true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    resave: false,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: 3600000 },
}))

const auth = (req, res, next) => {
    if (req.session && req.session.loggedIn) return next()
    else res.status(401).send('Unauthorized')
};

const port = process.env.PORT || 8080;
const version = process.env.VERSION || 1;
const hostname = process.env.HOSTNAME;
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

function sanitize(input) {
    let escaped;
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
    pool.query(query, [sanitize(req.params.username)], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No id with that username found" });
        } else {
            res.json({ id: results[0].id });
        }
    });
});

// user: get user information from user_id
// example: /v1/user/info/
app.get(`/v${version}/user/info/`, auth, async (req, res) => {
    const query = `SELECT * FROM ${database}.users WHERE id = ?`;
    pool.query(query, [req.session.user.id], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No user with that id found" });
        } else {
            res.json({status: "ok", data:results[0]});
        }
    });
});
// user: use login with username, password
// example: /v1/user/login
app.post(`/v${version}/user/login/`, async (req, res) => {
    let params = req.body;
    const query = `SELECT * FROM ${database}.users WHERE username = ?`;
    pool.query(query, [sanitize(params.username)], (error, results) =>
    {
        if (!results[0]) {
            res.json({ error_message: "No user with that username found" });
        } else {
            if (results[0].password_hash === sanitize(sha256(params.password))) {
                req.session.loggedIn = true;
                req.session.user = results[0].id;
                res.json({ status:"ok" });
            } else {
                res.json({ error_message: "Password is invalid" });
            }
        }
    });
});

// user: destroy session with logout
// example: /v1/user/logout
app.get(`/v${version}/user/logout/`, function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});


// songs: read song information from song_id
// example: /v1/song/info/0
app.get(`/v${version}/song/info/:id`, async (req, res) => {
    const query = `SELECT * FROM ${database}.songs WHERE id = ?`;
    pool.query(query, [sanitize(req.params.id)], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "No song with that id found" });
        } else {
            res.json({ status: "ok", data:results[0]});
        }
    });
});

// user_preferences: get user_preferences for user in session
// example: /v1/user_preferences/
app.get(`/v${version}/user_preferences/info`, auth, async (req, res) => {
    const query = `SELECT * FROM ${database}.user_preferences WHERE user_id = ?`;
    pool.query(query, [req.session.user.id], (error, results) => {
        if (!results[0]) {
            res.json({ error_message: "This user has no preferences yet" });
        } else {
            res.json({data:results});
        }
    });
});

// user_preferences: insert record into user_preferences
// example: /v1/user_preferences/new
app.post(`/v${version}/user_preferences/new`, auth, async (req, res) => {
    const data = {
        user_id: req.session.user.id,
        song_id: sanitize(req.body.song_id),
        score: sanitize(req.body.score),
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
app.post(`/v${version}/user_preferences/update`, auth, async (req, res) => {
    const data = {
        song_id: req.body.song_id,
        score: req.body.score,
    };
    const query = `UPDATE ${database}.user_preferences SET score=score+? WHERE id= ?`;
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
