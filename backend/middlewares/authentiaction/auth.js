const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const config = require("../../config/config.json");
const user = require('../../models').user;
const path = require('path');
const passport = require('passport');
const localPassport = require('passport-local').Strategy;
const validatePassword = require('../../util/auth').validatePassword;
require('dotenv').config({ path: path.resolve('./.env') });

const mode = process.env.MODE.toLowerCase();


const { database, username, password, host, port, dialect } = config[mode];

const verifyCallback = async (username, password, done) => {
    try {
        const User = await user.findOne({ where: { Name: username } });

        if (!User) {
            { return done(null, false, { message: "bad username or password" }) };
        };

        const valid = await validatePassword(password, User.password);

        if (valid) {
            { return done(null, User, { message: "bad username or password" }) };
        }
        else {
            { return done(null, false, { message: "bad username or password" }) };
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
        return res.status(401).json({ "error": "unauthorized request" });
    };
};

exports.hasAuth = (req, res, next) => {

    if (req.isAuthenticated()) {
        return res.status(400).json({ error: "already signed in" });
    } else {
        return next();
    };
};

exports.isMod = (req, res, next) => {

};

exports.isAdmin = (req, res, next) => {

};