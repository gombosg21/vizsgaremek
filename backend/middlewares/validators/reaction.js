const reaction = require('../models').reaction;

exports.createRules = () => {
    return [
        validator.body('name'),
        validator.body('data')
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