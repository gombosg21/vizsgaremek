const valiadtor = require('express-validator');
const comment = require('../models').comment;
const thread = require('../models').thread;

exports.threadRules = () => 
{
    return[
        valiadtor.body("thread_name").notEmpty().withMessage("thread must have a name"),
        valiadtor.body("thread_name").isAscii().withMessage("only letters and numbers and simple special characters are allowed"),
        valiadtor.body("thread_name").isLength({max:100}).withMessage("thread name must be max 100 characters long")
    ]
};

exports.checkIfThreadExsits = async (req,res,next) => {

    const threadID = req.params.thread_ID;

    if(await thread.findOne({where:{ID : threadID}}) === null) 
    {
        return res.status(406).json({"error":`thread with id:${threadID} does not exsits`});
    } 
    else
    {
       return next(); 
    }
}