const valiadtor = require('express-validator');
const user = require('../../models').user;

const password_min = 8;
const password_max = 32;

exports.registerRules = () => 
{
    return [
    valiadtor.body('email').notEmpty().withMessage("email cannot be empty"),
    valiadtor.body('email').isEmail().withMessage("Invalid email format"),
    valiadtor.body('password').notEmpty().withMessage("password cannot be empty"),
    valiadtor.body('password').isLength({min: password_min,max:password_max}).withMessage(`password must be within ${password_min} and ${password_max} characters long`),
    valiadtor.body('password').isStrongPassword().withMessage("too weak password, try a different one"),
    valiadtor.body('re_password').custom((value,{req,loc,path}) => {if(value !== req.body.password) {throw new Error("password fields must match")}else{return value;}}),
    valiadtor.body('birth_date').notEmpty().withMessage("select a birth date"),
    valiadtor.body('birth_date').isDate().withMessage("invalid date format"),
    valiadtor.body('gender').notEmpty().withMessage("select a gender"),
    valiadtor.body('gender').isInt({min:0,max:2}).withMessage("unknown gender type")
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

exports.validateRegistration = async (req,res,next) => 
{
    const errors = valiadtor.validationResult(req);

    if (errors.isEmpty()) 
    {
       return next();
    }

    const errorList = [];
    errors.array().map(err => errorList.push({[err.param]:err.msg}))

    return res.status(422).json({error: errorList})
}