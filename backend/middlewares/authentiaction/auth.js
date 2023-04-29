const user = require('../../models').user;
const passport = require('passport');
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;
const publicJWT = require('../../util/auth').readPublicJWT;

const publicKey = publicJWT();

const options = {
    secretOrKey: publicKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256'],
    ignoreExpiration: false,
    jsonWebTokenOptions: {
        complete: false,
        clocktolearnce: '',
        maxAge: '1h',
        clockTimestamp: 100,
    }
};

const verifyCallback = async (payload, done) => {
    try {
        const User = await user.findOne({ where: { ID: payload.sub } });

        if (!User) {
            return done(null, false, { message: "bad username or password" });
        } else {
            return done(null, User);
        };
    }
    catch (error) {
        console.error(error);
        return done(err, false, { message: "something went wrong..." });
    };
};

const dataFields = {
    usernameField: 'name',
    passwordField: "password"
};

exports.strategy = new JWTStrategy(options, verifyCallback);

exports.isAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {

        if (err) { console.log("error?"); return next(err) };
        if (!user) { console.log("no or invalid or expired payload"); return next(new Error('no token or invalid token')) };
        if (user) {
            req.user = user;
            return next();
        }
    })(req, res, next);
};

exports.hasAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
        if (user) { return next(new Error("already signed in")) };
        return next();
    })(req, res, next);
};

exports.optionalAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
        if (user) { req.user = user; return next(); };
        if (!user) { req.user = { ID: -1 }; return next(); };
        return next();
    })(req, res, next);
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