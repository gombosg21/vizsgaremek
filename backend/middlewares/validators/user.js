const { oneOf } = require('express-validator');
const valiadtor = require('express-validator');
const user = require('../../models').user;

const password_min = 8;
const password_max = 32;
const gender_start = 0;
const gender_end = 2;

var date = new Date();
var day = date.getDay();
var month = date.getMonth();
var year = date.getFullYear();
var currdate = new Date(year,month,day).getTime();


exports.registerRules = () => 
{
    return [
    valiadtor.body('name').notEmpty().withMessage('name cannot be empty'),    
    valiadtor.body('name').isLength({max:50}).withMessage('nam must be no more than 50 characters'),
    valiadtor.body('name').isAlphanumeric().withMessage('name cannot contain specail characters'),
    valiadtor.body('email').notEmpty().withMessage("email cannot be empty"),
    valiadtor.body('email').isEmail().withMessage("Invalid email format"),
    valiadtor.body('password').notEmpty().withMessage("password cannot be empty"),
    valiadtor.body('password').isLength({min: password_min,max:password_max}).withMessage(`password must be within ${password_min} and ${password_max} characters long`),
    valiadtor.body('password').isStrongPassword().withMessage("too weak password, try a different one"),
    valiadtor.body('re_password').custom((value,{req,loc,path}) => {if(value !== req.body.password) {throw new Error("password fields must match")}else{return value;}}),
    valiadtor.body('birth_date').notEmpty().withMessage("select a birth date"),
    valiadtor.body('birth_date').isDate().withMessage("invalid date format"),
    valiadtor.body('birth_date').toDate().custom((value,{req,loc,path}) => {if(value.getTime() > currdate){throw new Error("no future dates allowed")}else{return value;}}),
    valiadtor.body('gender').notEmpty().withMessage("select a gender"),
    valiadtor.body('gender').isInt({min:gender_start,max:gender_end}).withMessage("unknown gender type")
]
}

exports.searchRules = () => {
    return[
        valiadtor.query('name').isAscii().withMessage('cannot perform search w/o a name'),
        oneOf([
        valiadtor.query('date_start').exists().isDate().optional({nullable: true}),
        valiadtor.query('date_end').exists().isDate().optional({nullable: true}),
        valiadtor.query('gender').exists().isInt({min:gender_start,max:gender_end}).optional({nullable: true})
            ]
        )
    ]
}

exports.checkIfNameConflicts = async (req,res,next) => 
{
    const UserName = req.body.name;

    if(await user.findOne({where:{name: UserName}}) != null) 
    {
        return res.status(406)
        .json({"error":`username ${UserName} already exists`});
    } else 
    {
       return next();
    }
}

exports.checkIfUserIDExsits = async (req,res,next) => 
{
    const ID = req.params.userID;

    if(await user.findOne({where:{ID: ID}}) == null) 
    {
        return res.status(406)
        .json({"error" : `user with id:${ID} does not exist`});
    } else 
    {
       return next();
    }
}

exports.checkIfNameExsist = async (req,res,next) => 
{
    const Name = req.params.name;

    if(await user.findOne({where:{name: Name}}) == null) 
    {
        return res.status(406)
        .json({"error" : `username ${Name} does not exist`});
    } else 
    {
       return next();
    }
}