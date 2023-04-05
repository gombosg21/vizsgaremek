const reaction = require('../../models').reaction;
const validator = require('express-validator');

exports.createRules = () => {
    return [
        validator.body('name').notEmpty().withMessage("name cannot be empty"),
        validator.body('name').isAlpha().withMessage("name must be a string of characters only"),
        validator.body('name').isLength({ min: 3, max: 50 }).withMessage("name be least 3 characters and most 50 long"),
    ];
};

exports.addRules = () => {
    return [
        validator.body('reactions').exists().withMessage('reactions missing, aborting'),
        validator.body('reactions').isArray().withMessage('reactions must be an array'),
        validator.body('reactions.*').isNumeric().withMessage('reactions can only contain numbers'),
        validator.body('reactions.*').custom((value) => {
            if (value < 1 || value % 1 != 0) {
                throw new Error("reactions only contain non zero positive whole numbers")
            } else {
                return value;
            }
        })
    ];
};

exports.removeRules = () => {
    return [
        validator.body('id').exists().withMessage('reaction id missing aborting'),
        validator.body('id').isNumeric().withMessage('id must be a number'),
        validator.body('id').custom((value) => { if (value < 1 || value % 1 != 0) { throw new Error("id must be a positive non zero whole number") } else { return value } })
    ];
};


exports.reactionCheckIfNameConflicts = async (req, res, next) => {
    const reactionName = req.body.name;
    try {
        const Reaction = await reaction.findOne({ where: { name: reactionName } });

        if (Reaction) {
            return res.status(400).json({ error: `reaction with name : ${reactionName} already exsist.` })
        } else {
            return next();
        };

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.checkIfReactionIDExsist = async (req, res, next) => {
    const ID = req.params.reactionID;
    try {
        const Reaction = await reaction.findByPk(ID);
        if (!Reaction) {
            return res.status(404).json({ error: `reaction with id : ${ID} does not exsits` });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};