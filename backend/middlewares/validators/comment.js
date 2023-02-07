const valiadtor = require('express-validator');
const comment = require('../models').comment;

exports.commentRules = () => {
    return [
        valiadtor.body('comment_text').notEmpty().withMessage("cant post empty comment."),
        valiadtor.body('comment_text').isAscii().withMessage("only letters and numbers and simple special characters are allowed"),
        valiadtor.body('comment_text').isLength({max:5000}).withMessage("no more than 5000 characters allowed")
    ]
}

exports.checkIfCommentExsist = async (req,res,next) => {

    const commentID = req.params.comment_ID;

    if(await comment.findOne({where:{ID: commentID}}) === null) 
    {
        return res.status(406).json({"error":`comment with id:${commentID} does not exsist`})
    }
    else
    {
        return next();
    }
}
