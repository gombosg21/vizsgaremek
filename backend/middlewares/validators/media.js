const validator = require('express-validator');
const media = require('../../models').media;
const tags = require('../../models').tag;
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
        validator.query().isAscii().withMessage("only text and simple characters are allowed in query")
    ]
};

exports.checkIfMediaIDExsist = async (req, res, next) => {
    const mediaID = req.params.media_ID;

    if (await media.findOne({ where: { id: mediaID } }) == null) {
        return res.status(404)
            .json({ "error": `media with id:${mediaID} does not exsist` });
    } else {
        return next();
    };
};

exports.validateUploadFile = (req, res, next) => {

    const mediaData = req.file;

    if (mediaData == null || undefined) {
        return res.status(400)
            .json({ "error": "no file given" });
    };

    var type = filetype.filetypemime(mediaData);

    if (type[0].match(/image/gi)) {
        return next();
    } else {
        return res.status(400)
            .json({ "error": "invalid file format, must be an image only." });
    };
};

exports.validateTags = async (req, res, next) => {
    const tagNames = req.body.tags;

    if (tagNames[0] == undefined) {
        return res.status(400)
            .json({ "error": "tag list cannot be empty" });
    };

    var badTag = false;
    const badTagList = [];
    for (let i = 0; i < tagNames.lenght(); i++) {
        var tag = await tags.findOne({ where: { name: tagNames[i] } });
        if (tag == null) {
            badTag = true;
            badTagList.push(tag.name);
        };
    };

    if (badTag == true) {
        return res.status(400)
            .json({ "error": `invalid tags: ${badTagList} in list of tags` });
    }
    else {
        return next();
    };
};