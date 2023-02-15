const session = require("express-session");
const express = require('express');
const app = express();
const crypto = require('crypto');
const mysqlStore = require("express-mysql-session")(session);
const config = require("../../config/config.json");
const user = require('../../models').user;
const sessionStorage = require("../../models").session_store;

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
            session_id: 'sid',
            expires: 'expires',
            data: 'data',
        }
    }
})

const sessionConfig = session({
    name: "aaa",
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: (1000 * 60 * 60)
    }
});

exports.getAuth = async (req, res, next) => {

    const userName = req.params.name;
    const password = req.body.password;

    const UserPassword = await user.findOne({ where: { Name: userName }, attributes: ['password'] });

    try {
        if (UserPassword.password == password) {
            const userID = await user.findOne({ where: { name: userName }, attributes: ['ID'] });
            return sessionConfig(req,res,next);
        }
        else {
            return res.status(401)
                .redirect('/')
                .json({ "msg": "bad password" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    }
};

exports.isAuth = async (req, res, next) => {

    const authDetails = req.session;
    const user_ID = await sessionStorage.findOne({ where: { sid: authDetails.session_id }, attributes: ['user_ID'] })

    if (user_ID != null) {
        return next();
    }
    else {
        return res.status(403).redirect('./'.json({ "error": "unauthorized request" }));
    }
}

exports.revokeAuth = (req, res, next) => {

    try {
        if (req.connect.sid) {
            req.connect.sid.destroy((err) => {
                if (err) {
                    console.error(err);
                } else {
                    return next();
                }
            })
        }
        else {
            return res.status(409)
                .json({ "error": "no login session was present" })
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    }
};

exports.authChallenge = (req, res, next) => {

};