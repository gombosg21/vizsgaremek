const reaction = require('../models').reaction;
const validator = require('express-validator');

exports.createRules = () => {
    return [
        validator.body('name').notEmpty().withMessage("name cannot be empty"),
        validator.body('name').isAlpha().withMessage("name must be a string of characters only"),
        validator.body('name').isLength({min:3,max:50}).withMessage("name be least 3 characters and most 50 long"),
        validator.body('data').notEmpty().withMessage("data cannot be empty"),
    ];
};

exports.validateNewReactionData = () => {
    const reactionData = req.file;

    try {
        if (!reactionData) {
            return res.status(400)
                .json({ "error": "no file given" });
        };
        var type = filetype.filetypemime(reactionData);

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

exports.checkIfReactionIDExsist = async () => {
    const ID = req.params.reactionID;
    try { 
        const Reaction = await reaction.findByPk(ID);
        if (!Reaction) {
            return res.status(404).json({error:`reaction with id : ${ID} does not exsits`});
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};