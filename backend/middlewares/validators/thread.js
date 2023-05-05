const validator = require('express-validator');
const thread = require('../../models').thread;

exports.createThreadRules = () => {
    return [
        validator.body("name").notEmpty().withMessage("thread must have a name"),
        validator.body("name").isAscii().withMessage("only letters and numbers and simple characters are allowed"),
        validator.body("name").isLength({ max: 100 }).withMessage("thread name must be max 100 characters long")
    ]
};

exports.editThreadRules = () => {
    return [
        validator.oneOf([
            validator.body("name").exists(),
            validator.body("status").exists()
        ], "no changes, aborting" ),
        validator.body("name").optional({ nullable: true, checkFalsy: true }).isAscii().withMessage("only letters and numbers and simple characters are allowed"),
        validator.body("name").optional({ nullable: true, checkFalsy: true }).isLength({ max: 100 }).withMessage("thread name must be max 100 characters long"),
        validator.body("status").optional({ nullable: true, checkFalsy: true }).isNumeric().withMessage("thread status must be a number")
    ]
};

exports.searchThreadRules = () => {
    return [
        validator.oneOf([
            validator.query('name').exists(),
            validator.query('created_start').exists(),
            validator.query('created_end').exists(),
            validator.query('activity_start').exists(),
            validator.query('activity_end').exists(),
            validator.query('creater_id').exists(),
            validator.query('parent').exists(),
            validator.query('content').exists()
        ], "empty query, aborting" ),
        validator.query('name').optional({ nullable: true, checkFalsy: true }).isAlpha().withMessage('name can only be a string of letters'),
        validator.query('created_start').optional({ nullable: true, checkFalsy: true }).isDate().withMessage('created_start must be a valid date'),
        validator.query('created_end').optional({ nullable: true, checkFalsy: true }).isDate().withMessage('created_end must be a valid date'),
        validator.query('activity_start').optional({ nullable: true, checkFalsy: true }).isDate().withMessage('activity_start must be a valid date'),
        validator.query('activity_end').optional({ nullable: true, checkFalsy: true }).isDate().withMessage('activity_end must be a valid date'),
        validator.query('creater_id').optional({ nullable: true, checkFalsy: true }).isNumeric({ min: 1 }).withMessage('creater_id must be a whole number, abowe 0'),
        validator.query('parent').optional({ nullable: true, checkFalsy: true }).isAlpha().withMessage('parent type can only be a string of letters'),
        validator.query('content').optional({ nullable: true, checkFalsy: true }).isAscii().withMessage('content can only be a letters numbers and special characters')
    ]
};

exports.checkIfThreadIDExsits = async (req, res, next) => {
    const ID = req.params.threadID;

    try {
        const Thread = await thread.findByPk(ID)
        if (!Thread) {
            return res.status(404)
                .json({ "error": `thread with id : ${ID} does not exsits` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};