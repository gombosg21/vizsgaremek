const validator = require('express-validator');
const comment = require('../models').comment;
const thread = require('../models').thread;

exports.createThreadRules = () => {
    return[
        validator.body("thread_name").notEmpty().withMessage("thread must have a name"),
        validator.body("thread_name").isAscii().withMessage("only letters and numbers and simple characters are allowed"),
        validator.body("thread_name").isLength({max:100}).withMessage("thread name must be max 100 characters long")
    ]
};

exports.editThreadRules = () => {
    return[
        validator.body("thread_name").notEmpty().withMessage("thread must have a name"),
        validator.body("thread_name").isAscii().withMessage("only letters and numbers and simple characters are allowed"),
        validator.body("thread_name").isLength({max:100}).withMessage("thread name must be max 100 characters long")
    ]
};

exports.checkIfThreadExsits = async (req,res,next) => {

    const threadID = req.params.thread_ID;

    if(await thread.findOne({where:{ID : threadID}}) === null) {
        return res.status(404)
            .json({"error":`thread with id:${threadID} does not exsits`});
    } else {
       return next(); 
    };
};