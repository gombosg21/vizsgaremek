const reaction = require('../models').reaction;
const media = require('../models').media;
const thread = require('../models').thread;
const user = require('../models').user;
const comment = require('../models').comment;
const carousel = require('../models').carousel;

const toBase64 = require("../util/serialize-file").getBase64;

exports.getAllReactions = async (req, res, next) => {
    try {
        const reactionList = await reaction.findAll();

        return res.status(200).json(reactionList);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.createReaction = async (req, res, next) => {
    const reactionName = req.body.name;
    const reactiondata = req.file.buffer;

    try {
        const newReaction = await reaction.create({
            name: reactionName,
            data: await toBase64(reactiondata)
        });

        return res.status(201).json({ ID: newReaction.ID });
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.deleteReaction = async (req, res, next) => {
    const ID = req.params.reactionID;

    try {
        const Reaction = await reaction.findByPk(ID);
        await Reaction.delete();
        return res.status(200).json({ ID: Reaction.ID })
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.addReaction = async (req, res, next) => {
    const ID = (req.params.mediaID ?? req.params.userID ?? req.params.threadID ?? req.params.commentID) ?? req.params.storyID;
    const target = req.params.parent_type;
    try {

        switch (target) {
            case ("media"): {
                const targetMedia = await media.findByPk(ID);
                await targetMedia.addReactions();

                return res.status(200).json({ ID: targetMedia.ID });
            }
            case ("story"): {

            }
            case ("comment"): {

            }
            case ("thread"): {

            }
            case ("profile"): {

            }
            default: {
                return res.status(500);
            }
        };

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.removeReaction = async (req, res, next) => {
    const ID = (req.params.mediaID ?? req.params.userID ?? req.params.threadID ?? req.params.commentID) ?? req.params.storyID;
    const target = req.params.parent_type;
    try {

        switch (target) {
            case ("media"): {

            }
            case ("story"): {

            }
            case ("comment"): {

            }
            case ("thread"): {

            }
            case ("profile"): {

            }
            default: {
                return res.status(500);
            }
        };

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};
