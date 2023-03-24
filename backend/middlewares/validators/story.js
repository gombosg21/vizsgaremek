const arrayValidator = require('../../helpers/validation/array');
const validator = require('express-validator');
const carousel = require('../../models').carousel;

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
    return [
        validator.body('name').notEmpty().withMessage("name cannot be empty"),
        validator.body('name').isAscii().withMessage("name must be letters numbers and special characters only"),
        validator.body('description').notEmpty().withMessage('description cannot be empty'),
        validator.body('description').isAscii().withMessage('description must be letters numbers and special characters only'),
        validator.body('visibility').optional({ nullable: true, checkFalsy: true }).isNumeric({ min: 0, max: 3 }).withMessage('visibility must be a whole positive number in range of 0-3'),
        validator.body('medias').custom((value) => { return arrayValidator.isArray(value, "medias must be an array") }),
        validator.body('medias').custom((value) => { return arrayValidator.nonEmptyArray(value, "medias cannot be an empty array") }),
        validator.body('medias').custom((value) => {
            value.forEach(media => {
                if (media.ID == undefined) { throw new Error("media ID cannot be empty") };
                if (typeof media.ID != "number") { throw new Error("media ID must be a number"); };
                if (media.ID < 0) { throw new Error("media ID cannot be a negative number") };
                if (media.ID % 1 != 0) { throw new Error("media ID must be a whole number") };
            });
            return value;
        }),
        validator.body('medias').custom((value) => {
            value.forEach(media => {
                if (media.item_number == undefined) { throw new Error("media item_number cannot be empty") };
                if (typeof media.item_number != "number") { throw new Error("media item_number must be a number"); };
                if (media.item_number < 0) { throw new Error("media item_number cannot be a negative number") };
                if (media.item_number % 1 != 0) { throw new Error("media item_number must be a whole number") };
            });
            return value;
        }),
        validator.body('medias').custom((value) => {
            value.forEach(media => {
                if (media.item_description) {
                    if (typeof media.item_description != "string") { throw new Error("media item_description must be a string"); };
                };
            });
            return value;
        }),
    ];
};