const validator = require('express-validator');
const comment = require('../../models').comment;

exports.commentRules = () => {
    return [
        validator.body('content').notEmpty().withMessage("comment text cannot be empty"),
        validator.body('content').isAscii().withMessage("only letters and numbers and simple special characters are allowed"),
        validator.body('content').isLength({max:5000}).withMessage("no more than 5000 characters allowed")
    ]
};

exports.checkIfCommentIDExsist = async (req,res,next) => {

    const commentID = req.params.commentID;

    if(await comment.findOne({where:{ID: commentID}}) === null) {
        return res.status(400).json({"error":`comment with id:${commentID} does not exsist`});
    }
    else {
        return next();
    };
};
