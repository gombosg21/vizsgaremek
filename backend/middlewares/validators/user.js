const { oneOf } = require('express-validator');
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
        validator.body('name').isLength({ max: 50 }).withMessage('nam must be no more than 50 characters'),
        validator.body('name').isAlphanumeric().withMessage('name cannot contain special characters'),
        validator.body('email').notEmpty().withMessage("email cannot be empty"),
        validator.body('email').isEmail().withMessage("Invalid email format"),
        validator.body('password').notEmpty().withMessage("password cannot be empty"),
        validator.body('password').isLength({ min: password_min, max: password_max }).withMessage(`password must be within ${password_min} and ${password_max} characters long`),
        validator.body('password').isStrongPassword().withMessage("too weak password, try a different one"),
        validator.body('re_password').custom((value, { req, loc, path }) => { if (value !== req.body.password) { throw new Error("password fields must match") } else { return value; } }),
        validator.body('birth_date').notEmpty().withMessage("select a birth date"),
        validator.body('birth_date').isDate().withMessage("invalid date format"),
        validator.body('birth_date').toDate().custom((value, { req, loc, path }) => { if (value.getTime() > currdate) { throw new Error("no future dates allowed") } else { return value; } }),
        validator.body('gender').notEmpty().withMessage("select a gender"),
        validator.body('gender').isInt({ min: gender_start, max: gender_end }).withMessage("unknown gender type")
    ]
}

exports.searchRules = () => {
    return [validator.oneOf([
        validator.query('name').exists(),
        validator.query('date_start').exists(),
        validator.query('date_end').exists(),
        validator.query('gender').exists()
    ],"empty query"),
        [
            validator.query('name').isAlphanumeric().optional({nullable:true,checkFalsy:true}).withMessage('name cannot contain special characters'),
            validator.query('date_start').isDate().optional({nullable:true,checkFalsy:true}).withMessage("invalid date format"),
            validator.query('date_end').isDate().optional({nullable:true,checkFalsy:true}).withMessage("invalid date format"),
            validator.query('gender').isInt({ min: gender_start, max: gender_end }).optional({nullable:true,checkFalsy:true}).withMessage("unknown gender type")
        ],]
}

exports.checkIfNameConflicts = async (req, res, next) => {
    const UserName = req.body.name;

    if (await user.findOne({ where: { name: UserName } }) != null) {
        return res.status(406)
            .json({ "error": `username ${UserName} already exists` });
    } else {
        return next();
    }
}

exports.checkIfUserIDExsits = async (req, res, next) => {
    const ID = req.params.userID;

    if (await user.findOne({ where: { ID: ID } }) == null) {
        return res.status(406)
            .json({ "error": `user with id:${ID} does not exist` });
    } else {
        return next();
    }
}

exports.checkIfNameExsist = async (req, res, next) => {
    const Name = req.params.name;

    if (await user.findOne({ where: { name: Name } }) == null) {
        return res.status(406)
            .json({ "error": `username ${Name} does not exist` });
    } else {
        return next();
    }
}