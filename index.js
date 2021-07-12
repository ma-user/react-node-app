const express = require("express");
const sql = require('mssql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const utils = require('./utils');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(session({
    name: //,
    resave: false,
    saveUninitialized: false,
    secret: //,
    cookie: {
        httpOnly:true,
        expires: 300000
    }
}));

const config = {
    user: //,
    password: //,
    server: //,
    database: //,
    options: {
        encrypt: true
    }
}

sql.connect(config);

const userData = {
    email: "admin@namasys.co",
    password: "admin123"
};

const verifyJWT = (req, res, next) => {
    const token = req.headers["authorization"];
    if(!token) return next();
    jwt.verify(token, "//secret", {expiresIn: '300'}, (err, user) => {
        if(err) {
            res.json({ error: true, message: "Invalid user!" });
        } else {
            req.user = user;
            next();
        }
    });
};

app.get('/form', verifyJWT, (req, res) => {
    const request = new sql.Request();
    request.query("SELECT * FROM users", (err, result) => {
        if(err) {
            console.log("error: ", err);
        } else {
            res.send(result);
        }
    });
});

app.get('/verifyToken', verifyJWT, (req, res) => {
    const token = req.body.token || req.query.token;
    if(!token && !req.session.user) {
        res.json({ loggedIn: false, error: true, message: "Token is required!" });
    }
    res.json({loggedIn: true, token: token, user: userData });
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    
    if(!email || !password) {
       return res.json({ error: true, message: "Email or Password is required!" });
    }

    if(email !== userData.email || password !== userData.password) {
       return res.json({ error: true, message: "Email or password is wrong!" });
    }

    const token = utils.generateToken(userData);
    const userObj = utils.getCleanUser(userData);
    req.session.user = userData;
    return res.json({ user: userObj, token: token });
});

app.post('/users', (req, res) => {
    const request = new sql.Request();
    request.query("INSERT INTO users (username, mobile, email, address) VALUES ('" + req.body.username + "', '" + req.body.mobile + "', '" + req.body.email + "', '" + req.body.address + "')", (err, result) => {
        if(err) {
            console.log("error: ", err);
        } else {
            console.log("User added successfully.");
        }
    });
    res.redirect('/form');
});

app.delete('/delete', (req, res) => {
    const id = req.query.id;
    const request = new sql.Request();
    request.query("DELETE FROM users WHERE id = " + id, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log("User deleted successfully.")
        }
    });
    res.json({deleted: true, id: id});
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('build'));
    app.get('/*', (req, res) => {
        req.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    })
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
