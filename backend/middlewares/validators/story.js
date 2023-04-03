const validator = require('express-validator');
const carousel = require('../../models').carousel;
const media = require('../../models').media;

//No async middlewares :(

exports.checkIfStoryIDExsits = async (req, res, next) => {
    const ID = req.params.storyID;
    try {
        const story = await carousel.findByPk(ID);
        if (!story) {
            return res.status(404).json({ "error": `carousel with id : ${ID} does not exsits` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.createStoryRules = () => {
    // const mediaIDs = (await media.findAll({ attributes: ['ID'] })).map(Media => Media.ID);
    const item_number_list = [];
    return [
        validator.body('name').notEmpty().withMessage("name cannot be empty"),
        validator.body('name').isAscii().withMessage("name must be letters numbers and special characters only"),
        validator.body('description').notEmpty().withMessage('description cannot be empty'),
        validator.body('description').isAscii().withMessage('description must be letters numbers and special characters only'),
        validator.body('visibility').optional({ nullable: true, checkFalsy: true }).isNumeric({ min: 0, max: 3 }).withMessage('visibility must be a whole positive number in range of 0-3'),
        validator.body('medias').isArray().withMessage("medias must be an array"),
        validator.body('medias').isArray({ min: 1 }).withMessage("medias cannot be an empty array"),
        validator.body('medias.*.ID').exists().withMessage("medias must have a field ID"),
        validator.body('medias.*.ID').isNumeric().withMessage("media ID must be a number"),
        validator.body('medias.*.ID').custom((value) => { if (value < 1 || value % 1 != 0) { throw new Error("media ID must be a positive non-zero whole number") } else { return value } }),
        // validator.body('medias.*.ID').custom((value) => { if (!(mediaIDs.contains(value))) { throw new Error("media ID must be a positive non-zero whole number") } else { return value } }),
        validator.body('medias.*.item_number').exists().withMessage("medias must have a field item_number"),
        validator.body('medias.*.item_number').isNumeric().withMessage("item number must be a number"),
        validator.body('medias.*.item_number').custom((value) => { if (value < 0 || value % 1 != 0) { throw new Error("item number must be a whole positive number") } else { return value } }),
        validator.body('medias.*.item_number').custom((value) => {
            if (item_number_list.contains(value)) { throw new Error("item_number must be be an unique number") }
            else {
                item_number_list.push(value);
                return value
            };
        }),
        validator.body('medias.*.item_description').optional({ nullable: true, checkFalsy: true }).isAscii().withMessage("item description can only be made of letters numbers and special characters")
    ];
};

exports.editStoryRules = () => {
    return [
        validator.oneOf([
            validator.body('name').exists(),
            validator.body('visibility').exists(),
            validator.body('description').exists(),
            validator.body('add_medias').exists(),
            validator.body('remove_media_ids').exists(),
            validator.body('change_medias').exists()
        ], "no changes made, aborting"),
        validator.body('name').isAlphanumeric().optional({ nullable: true, checkFalsy: true }).withMessage("name must only contain letters and numbers"),
        validator.body('visibility').isNumeric().optional({ nullable: true, checkFalsy: true }).withMessage("visibility must be a number"),
        validator.body('visibility').custom((value) => {
            if (value % 1 != 0 || value < 0) { throw new Error("visibility must be a positive whole number") } else { return value };
        }).optional({ nullable: true, checkFalsy: true }),
        validator.body('visibility').custom((value) => {
            if (value > 3 || value < 0) { throw new Error("visibility must be in range of 0-3") } else { return value };
        }).optional({ nullable: true, checkFalsy: true }),
        validator.body('description').isAscii().optional({ nullable: true, checkFalsy: true }).withMessage("description must be made of letters numbers and special characters only"),
        validator.body('add_medias').isArray().optional({ nullable: true, checkFalsy: true }).withMessage("add_medias must be an array"),
        validator.body('add_medias.*.ID').if(validator.body('add_medias').exists())
        .exists().withMessage("add_medias must have a field ID")
        .isNumeric().withMessage("add_medias field ID must be a number")
        .custom((value) => { if (value < 1 || value % 1 != 0) { throw new Error("add_medias field ID must be a non zero poisitive whole number") } else { return value } }),
        validator.body('add_medias.*.item_number').if(validator.body('add_medias').exists())
        .exists().withMessage("add_medias must have a field item_number")
        .isNumeric().withMessage("add_medias field item_number must be a number")
        .custom((value) => { if (value < 0 || value % 1 != 0) { throw new Error("add_medias field item_number must be a poisitive whole number") } else { return value } }).optional({ nullable: true, checkFalsy: true }),
        validator.body('add_medias.*.description').exists().optional({ nullable: true, checkFalsy: true }).withMessage("add_medias must have a field description"),
        validator.body('add_medias.*.description').isAscii().optional({ nullable: true, checkFalsy: true }).withMessage("add_medias field description can onyl contain letters numbers and special characters"),
        validator.body('remove_media_ids').isArray().optional({ nullable: true, checkFalsy: true }).withMessage("remove_media_ids must be an array"),
        validator.body('remove_media_ids.*').isNumeric().optional({ nullable: true, checkFalsy: true }).withMessage("remove_media_ids can contain only numbers"),
        validator.body('remove_media_ids.*').custom((value) => { if (value % 1 != 0 || value < 1) { throw new Error("remove_media_ids can only contain positive non zero whole numbers") } else { return value }; }).optional({ nullable: true, checkFalsy: true }),
        validator.body('change_medias').isArray().optional({ nullable: true, checkFalsy: true }).withMessage("change_medias must be an array"),
        validator.body('change_medias.*.ID').exists().optional({ nullable: true, checkFalsy: true }).withMessage("change_medias must have a field ID"),
        validator.body('change_medias.*.ID').isNumeric().optional({ nullable: true, checkFalsy: true }).withMessage("change_medias field ID must be a number"),
        validator.body('change_medias.*.ID').custom((value) => { if (value < 1 || value % 1 != 0) { throw new Error("change_medias field ID must be a non zero positive whole number") } else { return value } }).optional({ nullable: true, checkFalsy: true }),
        validator.body('change_medias.*.item_number').exists().optional({ nullable: true, checkFalsy: true }).withMessage("change_medias must have a filed item_number"),
        validator.body('change_medias.*.item_number').isNumeric().optional({ nullable: true, checkFalsy: true }).withMessage("change_medias filed item_number must be a number"),
        validator.body('change_medias.*.item_number').custom((value) => { if (value % 1 != 0 || value < 0) { throw new Error("change_medias field item_number must be a positive whole number") } else { return value; } }).optional({ nullable: true, checkFalsy: true }),
        validator.body('change_medias.*.description').exists().optional({ nullable: true, checkFalsy: true }).withMessage("change_medias must have a field description"),
        validator.body('change_medias.*.description').isAscii().optional({ nullable: true, checkFalsy: true }).withMessage("change_medias field description must be of letters numbers and special charaters only"),
    ];
};

exports.searchStoryRules = () => {
    return [
        validator.oneOf([
            validator.query('name').exists(),
            validator.query('description').exists(),
            validator.query('media_ids').exists(),
            validator.query('user_id').exists(),
            validator.query('created_start').exists(),
            validator.query('created_end').exists(),
            validator.query('edit_start').exists(),
            validator.query('edit_end').exists(),
        ], "no valid query params given, aborting"),
        validator.query('name').isAlphanumeric().optional({ nullable: true, checkFalsy: true }).withMessage('name can only be letters and numbers'),
        validator.query('description').isAscii().optional({ nullable: true, checkFalsy: true }).withMessage('description can only be letters numbers and special characters'),
        validator.query('user_id').isNumeric().optional({ nullable: true, checkFalsy: true }).withMessage('user_id must be a number'),
        validator.query('user_id').custom((value) => { if (value < 1 || value % 1 != 0) { throw new Error('user_id must be a non-zero prositive whole number') } else { return value } }).optional({ nullable: true, checkFalsy: true }).withMessage('user_id must be a number'),
        validator.query('created_start').isDate().optional({ nullable: true, checkFalsy: true }).withMessage('created_start must be a valid date'),
        validator.query('created_end').isDate().optional({ nullable: true, checkFalsy: true }).withMessage('created_end must be a valid date'),
        validator.query('created_end').custom((value, { req, location, path }) => {
            if (req.query.created_start && value) {
                if (Date(req.query.created_start) > Date(value)) {
                    throw new Error("created start must be less than created_end")
                }
                else {
                    return value
                };
            } else {
                return value
            };
        }).optional({ nullable: true, checkFalsy: true }),
        validator.query('edit_start').isDate().optional({ nullable: true, checkFalsy: true }).withMessage('edit_start must be a valid date'),
        validator.query('edit_end').isDate().optional({ nullable: true, checkFalsy: true }).withMessage('edit_start must be a valid date'),
        validator.query('edit_end').custom((value, { req, location, path }) => {
            if (req.query.edit_start && req.query.edit_end) {
                if (Date(req.query.edit_start) > Date(req.query.edit_end)) {
                    throw new Error("edit start must be less than edit end");
                } else {
                    return value;
                };
            } else {
                return value;
            };
        }).optional({ nullable: true, checkFalsy: true }),
    ];
};