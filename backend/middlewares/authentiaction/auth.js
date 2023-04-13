const user = require('../../models').user;
const path = require('path');
const passport = require('passport');
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;
require('dotenv').config({ path: path.resolve('./.env') });

const options = {
    secretOrKey: process.env.TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256'],
    ignoreExpiration: false,
    jsonWebTokenOptions: {
        complete: false,
        clocktolearnce: '',
        maxAge: '3h',
        clockTimestamp: 100,

    }
};

const verifyCallback = async (payload, done) => {
    try {
        const User = await user.findOne({ where: { ID: payload.sub } });

        if (err) {
            return done(err, false, { message: "something went wrong..." });
        };

        if (!User) {
            return done(null, false, { message: "bad username or password" });
        } else {
            return done(null, User);
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

exports.strategy = new JWTStrategy(options, verifyCallback);

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



exports.isAuth = (req, res, next) => {

    next(passport.authenticate('jwt', { session: false }));
};

exports.hasAuth = (req, res, next) => {
        return next();
};

exports.checkRole = (rolelevel) => {
    return (req, res, next) => {
        if (req.user.type === rolelevel) {
            return next();
        } else {
            return res.status(403).json({ error: "issuficient privilegdes" });
        };
    };
};