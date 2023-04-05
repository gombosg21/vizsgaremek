const validator = require('express-validator');
const filetype = require('magic-bytes.js');

exports.validate = async (req, res, next) => {
    const errors = validator.validationResult(req);

    if (errors.isEmpty()) { return next(); };

    const errorList = [];
    errors.array().map(err => errorList.push({ [err.param]: err.msg }));

    try {
        errors.array().flatMap((_error) => _error.map(err => errorList.push({ [err.param]: err.msg })));
    } catch (err) { console.error(err) };

    return res.status(400).json({ error: errorList });
};

exports.validateImage = (req, res, next) => {
    const reactionData = req.file.buffer;

    try {
        if (!reactionData) {
            return res.status(400)
                .json({ "error": "no file given" });
        };
        var type = filetype.filetypemime(reactionData);

        if (type[0].match(/image/gi)) {
            return next();
        } else {
            return res.status(400)
                .json({ "error": "invalid file format, must be type of image." });
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};