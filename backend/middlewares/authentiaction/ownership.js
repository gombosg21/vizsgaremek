const { Op } = require("sequelize");
const thread = require('../../models').thread;
const comment = require('../../models').comment;
const media = require('../../models').media;


exports.isMyMedia = async (req, res, next) => {
    const userID = req.user.ID ?? -1;
    const mediaID = req.params.mediaID;
    try {
        const mediaOwner = await media.findOne({where:{[Op.and]:[{user_ID : userID},{ID:mediaID}]},atrributes:['user_ID']}).user_ID;
        if (userID != mediaOwner) {
            return res.status(403).json({ "error": "insufficienct privilegdes" });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.isMyComment = async (req, res, next) => {
    const userID = req.user.ID ?? -1;
    const commentID = req.params.commentID;
    try {
        const commentOwner = await comment.findOne({where:{[Op.and]:[{user_ID:userID},{ID:commentID}],atrributes:['user_ID']}}).user_ID;
        if (userID != commentOwner) {
            return res.status(403).json({ "error": "insufficienct privilegdes" });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.isMyThread = async (req, res, next) => {
    const userID = req.user.ID ?? -1;
    const threadID = req.params.threadID;
    try {
        const threadOwner = await thread.findOne({where:{[Op.and]:[{user_ID:userID},{ID:threadID}],atrributes:['user_ID']}}).user_ID;
        if (userID) {
            return res.status(403).json({ "error": "insufficienct privilegdes" });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};
