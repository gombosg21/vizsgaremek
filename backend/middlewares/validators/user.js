const validator = require('express-validator');
const user = require('../../models').user;

const password_min = 8;
const password_max = 32;
const gender_start = 0;
const gender_end = 2;

var date = new Date();
var day = date.getDay();
var month = date.getMonth();
var year = date.getFullYear();
var currdate = new Date(year, month, day).getTime();


exports.registerRules = () => {
    return [
        validator.body('name').notEmpty().withMessage('name cannot be empty'),
        validator.body('name').isAlphanumeric().withMessage('name cannot contain special characters'),
        validator.body('name').isLength({ max: 50 }).withMessage('nam must be no more than 50 characters'),
        validator.body('email').notEmpty().withMessage("email cannot be empty"),
        validator.body('email').isEmail().withMessage("Invalid email format"),
        validator.body('password').notEmpty().withMessage("password cannot be empty"),
        validator.body('password').isLength({ min: password_min, max: password_max }).withMessage(`password must be within ${password_min} and ${password_max} characters long`),
        validator.body('password').isStrongPassword().withMessage("too weak password, try a different one"),
        validator.body('re_password').custom((value, { req, loc, path }) => { if (value !== req.body.password) { throw new Error("password and re_password fields must match") } else { return value; } }),
        validator.body('birth_date').notEmpty().withMessage("select a birth date"),
        validator.body('birth_date').isDate().withMessage("invalid date format"),
        validator.body('birth_date').toDate().custom((value, { req, loc, path }) => { if (value.getTime() > currdate) { throw new Error("no future dates allowed") } else { return value; } }),
        validator.body('gender').notEmpty().withMessage("select a gender"),
        validator.body('gender').isInt({ min: gender_start, max: gender_end }).withMessage("unknown gender type")
    ]
};

exports.searchRules = () => {
    return [validator.oneOf([
        validator.query('name').exists(),
        validator.query('date_start').exists(),
        validator.query('date_end').exists(),
        validator.query('gender').exists()
    ], "empty query, aborting"),
    [
        validator.query('name').isAlphanumeric().optional({ nullable: true, checkFalsy: true }).withMessage('name cannot contain special characters'),
        validator.query('date_start').isDate().optional({ nullable: true, checkFalsy: true }).withMessage("invalid date format"),
        validator.query('date_end').isDate().optional({ nullable: true, checkFalsy: true }).withMessage("invalid date format"),
        validator.query('gender').isInt({ min: gender_start, max: gender_end }).optional({ nullable: true, checkFalsy: true }).withMessage("unknown gender type")
    ],]
};

exports.updateProfileRules = () => {
    return [validator.oneOf([
        validator.body("profile_description").exists(),
        validator.body("profile_visibility").exists(),
        validator.body("profile_picture").exists()
    ], "no changes, aborting"),
    [
        validator.body("profile_description").isAscii().optional({ nullable: true, checkFalsy: true }).withMessage("no advanced special characters allowed"),
        validator.body("profile_visibility").isInt({ min: 0, max: 3 }).optional({ nullable: true, checkFalsy: true }).withMessage("unknown visibility level"),
        validator.body("profile_picture").isInt().optional({ nullable: true, checkFalsy: true }).withMessage("profile picture must be a numeric ID")
    ]
    ]
};

exports.changePasswordRules = () => {
    return [
        validator.body('password').notEmpty().withMessage("password cannot be empty"),
        validator.body('password').isLength({ min: password_min, max: password_max }).withMessage(`password must be within ${password_min} and ${password_max} characters long`),
        validator.body('password').isStrongPassword().withMessage("too weak password, try a different one"),
        validator.body('re_password').custom((value, { req, loc, path }) => { if (value !== req.body.password) { throw new Error("password fields must match") } else { return value; } }),
    ]
};

exports.checkIfNameConflicts = async (req, res, next) => {
    const UserName = req.body.name;

    try {
        const User = await user.findOne({ where: { name: UserName } })
        if (User) {
            return res.status(400)
                .json({ "error": `username ${UserName} already exists` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.checkIfUserIDExsits = async (req, res, next) => {
    const ID = req.params.userID;

    try {
        const User = await user.findByPk(ID);
        if (!User) {
            return res.status(404)
                .json({ "error": `user with id:${ID} does not exist` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.checkIfNameExsist = async (req, res, next) => {
    const Name = req.params.name;

    try {
        const User = await user.findOne({ where: { name: Name }});
        if (!User) {
            return res.status(404)
                .json({ "error": `username ${Name} does not exist` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};