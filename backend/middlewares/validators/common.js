const valiadtor = require('express-validator');

exports.validate = async (req,res,next) => 
{
    const errors = valiadtor.validationResult(req);

    if (errors.isEmpty()) 
    {
       return next();
    }

    const errorList = [];
    errors.array().map(err => errorList.push({[err.param]:err.msg}))

    return res.status(422).json({error: errorList})
};