const validator = require('express-validator');
const media = require('../../models').media;
const tag = require('../../models').tag;
const filetype = require('magic-bytes.js');
const arrayValidation = require('../../helpers/validation/array');

exports.uploadRules = () => {
    return [
        validator.body('placeholder_text').notEmpty().withMessage("placeholder_text cannot be empty"),
        validator.body('placeholder_text').isAlphanumeric().withMessage("placeholder_text must be a string of letters and numbers only"),
        validator.body('tag_id_array').notEmpty().withMessage("media must have tags"),
        validator.body("tag_id_array").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.isArray(vaule,"tag_id_array must be an array"); }),
        validator.body("tag_id_array").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.nonEmptyArray(vaule, "tag_id_array cannot be any empty array"); }),
        validator.body("tag_id_array").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.itemIDOnylArray(vaule, "tag_id_array can only contain poistive non zero whole numbers"); }),
    ]
};

exports.editRules = () => {
    return [
        validator.body('placeholder_text').notEmpty().withMessage("placeholder_text cannot be empty")
    ]
};

exports.searchByTagRules = () => {
    return [
        validator.query().notEmpty().withMessage("cannot process empty query"),
        validator.query().isAscii().withMessage("only text and simple characters are allowed in search query")
    ]
};

exports.editTagRules = () => {
    return [
        validator.oneOf([
            validator.body("tag_id_list_remove").exists(),
            validator.body("tag_id_list_add").exists()
        ], "no changes made aborting"), [
            validator.body("tag_id_list_remove").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.isArray(vaule,"tag_id_list_remove must be an array"); }),
            validator.body("tag_id_list_remove").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.nonEmptyArray(vaule, "tag_id_list_remove cannot be any empty array"); }),
            validator.body("tag_id_list_remove").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.itemIDOnylArray(vaule, "tag_id_list_remove can only contain poistive non zero whole numbers"); }),
            validator.body("tag_id_list_add").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.isArray(vaule,"tag_id_list_add must be an array"); }),
            validator.body("tag_id_list_add").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.nonEmptyArray(vaule, "tag_id_list_add cannot be any empty array"); }),
            validator.body("tag_id_list_add").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { return arrayValidation.itemIDOnylArray(vaule, "tag_id_list_add can only contain poistive non zero whole numbers"); }),
        ]
    ]
};

exports.checkIfMediaIDExsist = async (req, res, next) => {
    const ID = req.params.mediaID;

    try {
        const Media = await media.findByPk(ID);
        if (!Media) {
            return res.status(404)
                .json({ "error": `media with id:${ID} does not exsist` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
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
        return res.status(500);
    };
};

exports.vaildateTagIDs = () => {

};