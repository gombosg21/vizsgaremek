const validator = require('express-validator');

exports.activityQueryRules = () => {
    return [
        validator.query("").optional({nullable:true,checkFalsy:true}).isNumeric().withMessage(""),
        validator.query("").optional({nullable:true,checkFalsy:true}).isNumeric().withMessage("")
        ];
};