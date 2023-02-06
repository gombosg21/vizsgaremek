const valiadtor = require('express-validator');

const password_min = 8;
const password_max = 32;

exports.accountRules = () => 
{
    return [
    valiadtor.body('email').notEmpty().withMessage("email cannot be empty"),
    valiadtor.body('email').isEmail().withMessage("Invalid email format"),
    valiadtor.body('password').notEmpty().withMessage("password cannot be empty"),
    valiadtor.body('password').isLength({min: password_min,max:password_max}).withMessage(`password must be within ${password_min} and ${password_max} characters long`),
    valiadtor.body('password').isStrongPassword().withMessage("too weak password, try a different one"),
    valiadtor.body('birth_date').notEmpty().withMessage("select a birth date"),
    valiadtor.body('birth_date').isDate().withMessage("invalid date format"),
    valiadtor.body('gender').notEmpty().withMessage("select a gender"),
    validator.body('gender').isInt({min:0,max:2}).withMessage("unknow gender type")
]
}

exports.checkIfNameExsits = async (req,res,next) => 
{
    const UserName = req.body.name;

    if(await user.findOne({where:{name: UserName}}) != null) 
    {
        res.status(406)
        .json({"error":"username already exists"})
        return;
    } else 
    {
        next();
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