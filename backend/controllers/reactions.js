const reaction = require('../models').reaction;
const media = require('../models').media;
const thread = require('../models').thread;
const user = require('../models').user;
const comment = require('../models').comment;
const carousel = require('../models').carousel;
const media_reactions = require("../models").media_reactionlist;
const thread_reactions = require("../models").thread_reactionlist;
const comment_reactions = require("../models").comment_reactionlist;
const profile_reactions = require("../models").user_reactionlist;
const story_reactions = require("../models").carousel_reactionlist;
const toBase64 = require("../util/serialize-file").getBase64;

exports.getAllReactions = async (req, res, next) => {
    try {
        const reactionList = await reaction.findAll({ attributes: { exclude: ["deletedAt"] } });

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
    const reactionIDs = req.body.reactions;
    const userID = req.user.ID;

    try {

        switch (target) {
            case ("media"): {
                const targetItem = await media.findByPk(ID);
                const addList = [];
                reactionIDs.forEach(ID => {
                    addList.push({ media_ID: targetItem.ID, reaction_ID: ID, user_ID: userID })
                });

                await targetItem.addReactions(addList);

                return res.status(200).json({
                    ID: targetItem.ID,
                    reactions: reactionIDs
                });
            }
            case ("story"): {
                const targetItem = await carousel.findByPk(ID);
                const addList = [];
                reactionIDs.forEach(ID => {
                    addList.push({ carousel_ID: targetItem.ID, reaction_ID: ID, user_ID: userID })
                });

                await targetItem.addReactions(addList);

                return res.status(200).json({
                    ID: targetItem.ID,
                    reactions: reactionIDs
                });
            }
            case ("comment"): {
                const targetItem = await comment.findByPk(ID);
                const addList = [];
                reactionIDs.forEach(ID => {
                    addList.push({ comment_ID: targetItem.ID, reaction_ID: ID, user_ID: userID })
                });

                await targetItem.addReactions(addList);

                return res.status(200).json({
                    ID: targetItem.ID,
                    reactions: reactionIDs
                });
            }
            case ("thread"): {
                const targetItem = await thread.findByPk(ID);
                const addList = [];
                reactionIDs.forEach(ID => {
                    addList.push({ thread_ID: targetItem.ID, reaction_ID: ID, user_ID: userID })
                });

                await targetItem.addReactions(addList);

                return res.status(200).json({
                    ID: targetItem.ID,
                    reactions: reactionIDs
                });
            }
            case ("profile"): {
                const targetItem = await user.findByPk(ID);
                const addList = [];
                reactionIDs.forEach(ID => {
                    addList.push({ profile_ID: targetItem.ID, reaction_ID: ID, user_ID: userID })
                });

                await targetItem.addReactions(addList);

                return res.status(200).json({
                    ID: targetItem.ID,
                    reactions: reactionIDs
                });
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
    const userID = req.user.ID;
    const reactionID = req.body.id;

    try {

        switch (target) {
            case ("media"): {
                const targetReaction = await media_reactions.findOne({ where: { user_ID: userID, media_ID: ID, reaction_ID: reactionID } });

                await targetReaction.delete();
                return res.status(200);
            }
            case ("story"): {
                const targetReaction = await story_reactions.findOne({ where: { user_ID: userID, carousel_ID: ID, reaction_ID: reactionID } });

                await targetReaction.delete();
                return res.status(200);

            }
            case ("comment"): {
                const targetReaction = await comment_reactions.findOne({ where: { user_ID: userID, comment_ID: ID, reaction_ID: reactionID } });

                await targetReaction.delete();
                return res.status(200);

            }
            case ("thread"): {
                const targetReaction = await thread_reactions.findOne({ where: { user_ID: userID, thread_ID: ID, reaction_ID: reactionID } });

                await targetReaction.delete();
                return res.status(200);

            }
            case ("profile"): {
                const targetReaction = await profile_reactions.findOne({ where: { user_ID: userID, profile_ID: ID, reaction_ID: reactionID } });

                await targetReaction.delete();
                return res.status(200);

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
