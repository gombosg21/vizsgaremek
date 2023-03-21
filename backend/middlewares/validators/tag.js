const validator = require('express-validator');
const tag = require('../../models').tag;

exports.tagRules = () => {
    return [
        validator.body("tag_name").notEmpty().withMessage("tag must not be empty"),
        validator.body("tag_name").isAlpha().withMessage("tag can only contain letters"),
        validator.body("tag_name").isLength({ max: 50 }).withMessage("tag can only be 50 characters long max")
    ]
};

exports.searchRules = () => {
    return [
        validator.query("tag_name").notEmpty().withMessage("cannot process empty query"),
        validator.query("tag_name").isAlpha().withMessage("tag can only contain letters"),
        validator.query("tag_name").isLength({ max: 50 }).withMessage("tag can only be 50 characters long max")
    ]
};

exports.checkIfTagIDDoesNotExsits = async (req, res, next) => {
    const ID = req.params.ID;

    try {
        const Tag = await tag.findByPk(ID);
        if (!Tag) {
            return res.status(406)
                .json({ "error": `tag with id:${ID} does not exsits` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.checkIfTagNameAlreadyExsits = async (req, res, next) => {
    const tagName = req.body.tag_name;
    
    try {
        const conflictObject = await tag.findOne({ where: { name: tagName } });
        if (conflictObject) {
            return res.status(406)
                .json({ "error": `${tagName} already exsits` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};