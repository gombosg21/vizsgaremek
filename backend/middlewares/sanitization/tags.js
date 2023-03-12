const validator = require('express-validator');

exports.sanitizeTagName = (req,res,next) => {
    const tagName = req.body.tag_name;

    const sanitizedTagName = validator.sanitize(tagName).ltrim().escape();
    req.body.tag_name = sanitizedTagName;
    next();
};

exports.sanitizeTagNameS = (req,res,next) => {
    const tagNames = req.body.tags;
    const sanitizedTagNames = [];

    tagNames.forEach(tagName => {
        var sanitizedTagName = validator.sanitize(tagName).ltrim().escape();
        sanitizedTagNames.push(sanitizedTagName);
    });
    req.body.tags = sanitizedTagNames;
    next();
};