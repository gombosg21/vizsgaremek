const validator = require('express-validator');
const thread = require('../../models').thread;

exports.createThreadRules = () => {
    return[
        validator.body("name").notEmpty().withMessage("thread must have a name"),
        validator.body("name").isAscii().withMessage("only letters and numbers and simple characters are allowed"),
        validator.body("name").isLength({max:100}).withMessage("thread name must be max 100 characters long")
    ]
};

exports.editThreadRules = () => {
    return[validator.oneOf([
        validator.body("name").exists(),
        validator.body("status").exists()
    ])
       ,
        validator.body("name").optional({nullable:true,checkFalsy:true}).isAscii().withMessage("only letters and numbers and simple characters are allowed"),
        validator.body("name").optional({nullable:true,checkFalsy:true}).isLength({max:100}).withMessage("thread name must be max 100 characters long"),
        validator.body("status").optional({nullable:true,checkFalsy:true}).isNumeric().withMessage("thread status must be a number")
    ]
};

exports.searchThreadRules = () => {
    return[
        validator.oneOf([
            validator.query('name').exists(),
            validator.query('created_start').exists(),
            validator.query('created_end').exists(),
            validator.query('activity_start').exists(),
            validator.query('activity_end').exists(),
            validator.query('creater_id').exists(),
            validator.query('parent').exists()
        ],"empty query, aborting"),
        validator.query('name').optional({nullable:true,checkFalsy:true}),
        validator.query('created_start').optional({nullable:true,checkFalsy:true}),
        validator.query('created_end').optional({nullable:true,checkFalsy:true}),
        validator.query('activity_start').optional({nullable:true,checkFalsy:true}),
        validator.query('activity_end').optional({nullable:true,checkFalsy:true}),
        validator.query('creater_id').optional({nullable:true,checkFalsy:true}),
        validator.query('parent').optional({nullable:true,checkFalsy:true}).isAlpha().withMessage('parent type can only be a string of letters')
    ]
};

exports.checkIfThreadExsits = async (req,res,next) => {

    const threadID = req.params.threadID;

    if(await thread.findOne({where:{ID : threadID}}) === null) {
        return res.status(404)
            .json({"error":`thread with id:${threadID} does not exsits`});
    } else {
       return next(); 
    };
};