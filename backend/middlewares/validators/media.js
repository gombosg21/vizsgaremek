const validator = require('express-validator');
const media = require('../../models').media;
const tag = require('../../models').tag;
const filetype = require('magic-bytes.js');

exports.uploadRules = () => {
    return [
        validator.body('placeholder').notEmpty().withMessage("placeholder text cannot be empty")
    ]
};

exports.editRules = () => {
    return [
        validator.body('placeholder').notEmpty().withMessage("placeholder text cannot be empty")
    ]
};

exports.searchByTagRules = () => {
    return [
        validator.query().notEmpty().withMessage("cannot process empty query"),
        validator.query().isAscii().withMessage("only text and simple characters are allowed in search query")
    ]
};

exports.checkIfMediaIDExsist = async (req, res, next) => {
    const ID = req.params.mediaID;

    try {
        const Media = await media.FindByPk(ID);
        if (!Media) {
            return res.status(404)
                .json({ "error": `media with id:${ID} does not exsist` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.validateUploadFile = (req, res, next) => {
    const mediaData = req.file;

    try {
        if (!mediaData) {
            return res.status(400)
                .json({ "error": "no file given" });
        };
        var type = filetype.filetypemime(mediaData);

        if (type[0].match(/image/gi)) {
            return next();
        } else {
            return res.status(400)
                .json({ "error": "invalid file format, must be type of image." });
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.validateBodyTags = async (req, res, next) => {
    const tagNames = req.body.tags;

    const tagIDs = [];
    const validTagNames = [];

    try {
        if (tagNames[0] == undefined || null) {
            return res.status(400)
                .json({ "error": "tag list cannot be empty" });
        };
        const badTag = false;
        const badTagList = [];
        for (var tagName of tagNames) {
            var singleTag = await tag.findOne({ where: { name: tagName } });
            if (singleTag == null || undefined) {
                badTag = true;
                badTagList.push(tag.name);
            } else {
                tagIDs.push(singleTag.ID);
                validTagNames.push(singleTag.name);
            };
        };

        if (badTag) {
            return res.status(400)
                .json({ "error": `invalid tags: ${badTagList} in list of tags` });
        } else {
            req.body.tagIDs = tagIDs;
            req.body.tagNames = validTagNames;
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};