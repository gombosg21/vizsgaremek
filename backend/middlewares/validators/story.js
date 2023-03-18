const validator = require('express-validator');
const carousel = require('../models').carousel;

exports.checkIfStoryIDExsits = async (req,res,next) => {
    const ID = req.params.storyID;
    try {
        const story = await carousel.findByPK(ID);
        if (!story) {
            return res.status(404).json({"error":`carousel with id : ${ID} does not exsits`});
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

    ];
};