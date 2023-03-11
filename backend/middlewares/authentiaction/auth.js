const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const config = require("../../config/config.json");
const user = require('../../models').user;
const sessionStorage = require("../../models").session_store;
const path = require('path');
const passport = require('passport');
const localPassport = require('passport-local').Strategy;
const validatePassword = require('../../util/password').validatePassword;
require('dotenv').config({ path: path.resolve('./.env') });

const mode = process.env.MODE.toLowerCase();


const { database, username, password, host, port, dialect } = config[mode];

const verifyCallback = async (username, password, done) => {
    try {
        const User = await user.findOne({ where: { Name: username } });

        if (!User) {
            { return done(null, false) };
        };
               
        const valid = validatePassword(password, User.password_hash, User.password_salt);

        if (valid) {
            { return done(null, User) };
        }
        else {
            { return done(null, false) };
        };
    }
    catch (error) {
        done(error);
        console.error(error);
    };
};

const dataFields = {
    usernameField: 'name',
    passwordField: "password"
};

const roles = {
    Admin: "admin",
    Moderator: "mod",
    User: "user"
};

exports.strategy = new localPassport(dataFields, verifyCallback);

passport.serializeUser((User, done) => {
    done(null, User.ID);
});

passport.deserializeUser(async (userID, done) => {

    try {
        const User = await user.findByPk(userID);
        done(null, User);
    } catch (error) {

        done(error);
        console.error(error);
    };
});

const sessionStore = new mysqlStore({
    connectionLimit: 10,
    password: password,
    user: username,
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
});

exports.sessionConfig = {
    name: "VSCookie",
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: (1000 * 60 * 60),
    }
};



exports.isAuth = (req, res, next) => {

    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return res.status(401).redirect('/'.json({ "error": "unauthorized request" }));
    }
};

exports.isMod = (req, res, next) => {

};

exports.isAdmin = (req, res, next) => {

};

// exports.revokeAuth = (req, res, next) => {
//     console.log(req.session)
//     try {
//         if (req.sessionID) {
//             req.session.destroy((err) => {
//                 if (err) {
//                     console.error(err);
//                 } else {
//                     return next();
//                 }
//             })
//         }
//         else {
//             return res.status(409)
//                 .json({ "error": "no login session was present" })
//         };
//     } catch (error) {
//         console.error(error);
//         return res.status(500);
//     }
// };