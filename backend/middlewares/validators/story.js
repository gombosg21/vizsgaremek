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
            if (item_number_list.contains(value)) { throw new Error("item_number must be be an unique number")} else {
                item_number_list.push(value);
                return value
            };
        }),
        validator.body('medias.*.item_description').optional({nullable:true,checkFalsy:true}).isAscii().withMessage("item description can only be made of letters numbers and special characters")
    ];
};