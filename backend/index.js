require("dotenv").config();
const express = require('express');
const sha256 = require('js-sha256');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

var corsOptions = {
  origin: "http://localhost:19006",
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
    if (req.session) return next() // TODO: FIX SESSION RETAINING
    // if (req.session && req.session.loggedIn) return next()
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
    res.json({ status: "error", error_message: "Password is invalid" });    
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
                res.json({ status: "error", error_message: "Password is invalid" });
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
        if (!results[0]) 
            res.json({ error_message: "No song with that id found" });
        else 
            res.json({ status: "ok", data:results[0]});
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
app.post(`/v${version}/user_preferences/new`, auth, async (req, res) => { // TODO: change req.body.user_id to req.session.user
    const params = {
        user_id: req.body.user_id,
        song_id: req.body.song_id,
        score: req.body.score,
    }

    if (params.score != 0 && params.song_id != -1)
    {
        console.log("UPDATING")
        const query = `INSERT INTO ${database}.user_preferences(user_id, song_id, score) VALUES(?,?,?) ON DUPLICATE KEY UPDATE score=score+?`;
        pool.query(query, [params.user_id, params.song_id, params.score, params.score], (error) => {
            if (error) res.json({ status: "error", error_message: `${error.code}: Inserting record failed!` }); 
        });
    }

    const songQuery = `SELECT * FROM ${database}.songs`;

    pool.query(songQuery, [], (error, results) => {
        if (!results[0]) {
            res.json({ status: "error", error_message: "Unexpected error when requesting songs" });
        } else {
            const userQuery = `SELECT * FROM ${database}.user_preferences WHERE user_id = ?`;
            pool.query(userQuery, [params.user_id], async(error, data) => 
            {
                randList = JSON.parse(JSON.stringify(results))
                cantPlay = []
                for (let i=0; i<data.length; i++){
                    if (data[i].score == -1) cantPlay.push(data[i].song_id)
                    else for (let j=0; j<data[i].score; j++) randList.push(results[data[i].song_id])
                }
                for (let i=0; i<cantPlay.length; i++)
                    for(let j=0; j<randList.length; j++)
                        if (cantPlay[i] == randList[j].id) randList.splice(j, 1)
                            
                if (!randList[0]) res.json({ status: "error", error_message: "No liked songs in current selection, zooming to other part of the database"})
                else res.json ({ data: randList[Math.floor(Math.random() * randList.length)], status: "ok" });
            })
        }
    })
})


