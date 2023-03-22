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
        }
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.storyRules = () => {
    return [
        validator.body('name').notEmpty().withMessage("name cannot be empty"),
        validator.body('name').isAscii().withMessage("name must be letters numbers and special characters only"),
        validator.body('description').notEmpty().withMessage('description cannot be empty'),
        validator.body('description').isAscii().withMessage('description must be letters numbers and special characters only'),
        validator.body('visibility').optional({ nullable: true, checkFalsy: true }).isNumeric({ min: 0, max: 3 }).withMessage('visibility must be a whole positive number in range of 0-3')
    ];
};