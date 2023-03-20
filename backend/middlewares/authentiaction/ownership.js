const { Op } = require("sequelize");
const thread = require('../../models').thread;
const comment = require('../../models').comment;
const media = require('../../models').media;
const carousel = require('../../models').carousel;


exports.isMyMedia = async (req, res, next) => {
    const userID = req.user.ID;
    const mediaID = req.params.mediaID;
    try {
        const mediaOwner = await media.findOne({ where: { [Op.and]: [{ user_ID: userID }, { ID: mediaID }] } });
        if (!mediaOwner) {
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
    const userID = req.user.ID;
    const commentID = req.params.commentID;

    console.log(userID)

    try {
        const commentOwner = await comment.findOne({ where: { [Op.and]: [{ user_ID: userID }, { ID: commentID }] } });
        if (!commentOwner) {
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
    const userID = req.user.ID;
    const threadID = req.params.threadID;
    try {
        const threadOwner = await thread.findOne({ where: { [Op.and]: [{ user_ID: userID }, { ID: threadID }] } }).user_ID;
        if (!threadOwner) {
            return res.status(403).json({ "error": "insufficienct privilegdes" });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};

exports.isMyStory = async (req, res, next) => {
    const userID = req.user.ID;
    const storyID = req.params.storyID;
    try {
        const storyOwner = await carousel.findOne({ where: { [Op.and]: [{ ID: storyID }, { user_ID: userID }] } });
        if (!storyOwner) {
            return res.status(403).json({ "error": "insufficienct privilegdes" });
        } else {
            return next();
        };
    } catch (error) {
        console.error(error);
        res.status(500);
    };
};