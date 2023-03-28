const validator = require('express-validator');
const media = require('../../models').media;
const tag = require('../../models').tag;
const filetype = require('magic-bytes.js');

//middleware CANNOT be asnyc :(

exports.uploadRules = () => {
    //const tagIDs = (await tag.findAll({ attributes: ['ID'] })).map(tag => tag.ID);
    return [
        validator.body('visibility').optional({ nullable: true, checkFalsy: true }).isNumeric().withMessage('visibility must be a number'),
        validator.body('visibility').optional({ nullable: true, checkFalsy: true }).custom((value) => { if (value % 1 != 0) { throw new Error("visibility must be a whole number") } else { return value } }),
        validator.body('visibility').optional({ nullable: true, checkFalsy: true }).custom((value) => { if (value < 0 || value > 3) { throw new Error("visibility must be in range of 0-3") } else { return value } }),
        validator.body('placeholder_text').notEmpty().withMessage("placeholder_text cannot be empty"),
        validator.body('placeholder_text').isAlphanumeric().withMessage("placeholder_text must be a string of letters and numbers only"),
        validator.body('tag_id_array').notEmpty().withMessage("media must have tags"),
        validator.body("tag_id_array").isArray().withMessage("media tags must be supplied as an array"),
        validator.body("tag_id_array").isArray({ min: 1 }).withMessage("media tags array cannot be an empty array"),
        validator.body("tag_id_array.*").isNumeric().withMessage("media tag id must be a number"),
        validator.body("tag_id_array.*").custom((vaule) => { if (vaule % 1 != 0 || vaule < 1) { throw new Error("media tag id must be a whole positive non zero number") } else { return vaule } }),
        // validator.body("tag_id_array.*").custom((vaule) => {
        //     if (!(tagIDs.contains(vaule))) {
        //         throw new Error(`tag ID: ${vaule} does not exsits`);
        //     } else {
        //         return vaule;
        //     };
        //})
    ]
};

exports.editRules = () => {
    return [
        validator.body('placeholder_text').notEmpty().withMessage("placeholder_text cannot be empty")
    ]
};


// query can be an array or a string... cuz why not.
// exports.searchByTagRules = () => {
//     return [
//         validator.query('tagids').notEmpty().withMessage("cannot process empty query"),
//     ]
// };

exports.editTagRules = () => {
    // const tagIDs = (await tag.findAll({ attributes: ['ID'] })).map(tag => tag.ID);
    return [
        validator.oneOf([
            validator.body("tag_id_list_remove").exists(),
            validator.body("tag_id_list_add").exists()
        ], "no changes made aborting"), [
            validator.body("tag_id_list_remove").optional({ nullable: true, checkFalsy: true }).isArray().withMessage("tag_id_list_remove must be an array"),
            validator.body("tag_id_list_remove").optional({ nullable: true, checkFalsy: true }).isArray({ min: 1 }).withMessage("tag_id_list_remove cannot be any empty array"),
            validator.body("tag_id_list_remove.*").optional({ nullable: true, checkFalsy: true }).isNumeric().withMessage("tag_id_list_remove can only contain numbers"),
            validator.body("tag_id_list_remove.*").optional({ nullable: true, checkFalsy: true }).custom((value) => { if (value < 1 || value % 1 != 0) { throw new Error("tag_id__list_remove can only contain non-zero positive whole numbers") } else { return value } }),
            validator.body("tag_id_list_add").optional({ nullable: true, checkFalsy: true }).isArray().withMessage("tag_id_list_add must be an array"),
            validator.body("tag_id_list_add").optional({ nullable: true, checkFalsy: true }).isArray({ min: 1 }).withMessage("tag_id_list_add cannot be any empty array"),
            validator.body("tag_id_list_add.*").optional({ nullable: true, checkFalsy: true }).isNumeric().withMessage("tag_id_list_add can only contain numbers"),
            validator.body("tag_id_list_add.*").optional({ nullable: true, checkFalsy: true }).custom((vaule) => { if (vaule % 1 != 0 || vaule < 1) { throw new Error("tag_id_list_add can only contain non-zero positive whole numbers") } else { return vaule } }),
            //validator.body("tag_id_list_add.*").optional({ nullable: true, checkFalsy: true }).custom((vaule) => {
            //     if (!(tagIDs.contains(vaule))) {
            //         throw new Error(`tag ID: ${vaule} does not exsits`);
            //     } else {
            //         return vaule;
            //     };
            // }),
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