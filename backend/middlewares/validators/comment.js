const validator = require('express-validator');
const comment = require('../../models').comment;

exports.commentRules = () => {
    return [
        validator.body('content').notEmpty().withMessage("comment text cannot be empty"),
        validator.body('content').isAscii().withMessage("only letters and numbers and simple special characters are allowed"),
        validator.body('content').isLength({ max: 5000 }).withMessage("no more than 5000 characters allowed")
    ]
};

exports.checkIfCommentIDExsist = async (req, res, next) => {
    const ID = req.params.commentID;

    try {
        const Comment = await comment.findByPk(ID);
        if (!Comment) {
            return res.status(400).json({ "error": `comment with id:${ID} does not exsist` });
        }
        else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};
