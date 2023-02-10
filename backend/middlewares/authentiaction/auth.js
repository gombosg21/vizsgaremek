const session = require("express-session");
const crypto = require('crypto');
const util = require('util');
const mysqlStore = require("express-mysql-session")(session);
const config = require("../../config/config.json")

const mode = "development"

const { database, username, password, host, port, dialect } = config[mode]

var waitPreKey = crypto.randomBytes(64);
var secretKey = waitPreKey.toString('base64url');

const sessionStore = new mysqlStore({
    connectionLimit: 10,
    password: password,
    user: "root",
    database: database,
    host: host,
    port: port,
    createDatabaseTable: false,
    schema: {
        tableName: 'session_stores',
        columnNames: {
            session_id :'sid',
            expires: 'expires',
            data: 'data',
        }
    }
})

exports.sessionData = {
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
};

exports.getAuth = (req, res, next) => {
    var cookie = new session.Cookie();
    res.send(cookie);
    next();
};

exports.isAuth = (req, res, next) => {

    const authDetails = req.session

    if (authDetails.user == req.ID && authDetails.secret == secretKey) {
        return next();
    }
    else {
        return res.status(403).redirect('./'.json({ "error": "unauthorized request" }));
    }
}

exports.revokeAuth = (req, res, next) => {

};

exports.authChallenge = (req, res, next) => {

};