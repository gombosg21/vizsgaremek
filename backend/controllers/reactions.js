const reaction = require('../models').reaction;
const media_reactions = require("../models").media_reactionlist;
const thread_reactions = require("../models").thread_reactionlist;
const comment_reactions = require("../models").comment_reactionlist;
const profile_reactions = require("../models").profile_reactionlist;
const story_reactions = require("../models").carousel_reactionlist;
const toBase64 = require("../util/serialize-file").getBase64;
const { Op } = require("sequelize");

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
        const vaildReactionIDs = (await reaction.findAll({ attributes: ["ID"] })).map(Reaction => Reaction.ID);
        const filteredReactionIDs = [];
        const badReactionIDs = [];

        reactionIDs.forEach(ID => {
            if (vaildReactionIDs.includes(ID)) {
                filteredReactionIDs.push(ID);
            } else {
                badReactionIDs.push(ID);
            };
        });

        const addList = [];
        const exsistingReactionIDs = [];

        const results = {};

        switch (target) {
            case ("media"): {
                const exsistingUserReactions = (await media_reactions.findAll({ where: { [Op.and]: [{ user_ID: userID }, { media_ID: ID }] } })).map(Reaction => Reaction.reaction_ID);

                filteredReactionIDs.forEach(reactionID => {
                    if (exsistingUserReactions.includes(reactionID)) {
                        exsistingReactionIDs.push(reactionID)
                    } else {
                        addList.push({ media_ID: ID, reaction_ID: reactionID, user_ID: userID, date: Date.now() })
                    };
                });

                if (addList.length != 0) {
                    const addedReactions = await media_reactions.bulkCreate(addList);

                    results.reaction_ids = addedReactions.map(Reaction => Reaction.reaction_ID);
                };

                results.target = "media";
                results.ID = ID;
                break;
            }
            case ("story"): {
                const exsistingUserReactions = (await carousel_reactionlist.findAll({ where: { [Op.and]: [{ user_ID: userID }, { carousel_ID: ID }] } })).map(Reaction => Reaction.reaction_ID);

                filteredReactionIDs.forEach(reactionID => {
                    if (exsistingUserReactions.includes(reactionID)) {
                        exsistingReactionIDs.push(reactionID)
                    } else {
                        addList.push({ carousel_ID: ID, reaction_ID: reactionID, user_ID: userID, date: Date.now() });
                    };
                });

                if (addList.length != 0) {
                    const addedReactions = await carousel_reactionlist.bulkCreate(addList);

                    results.reaction_ids = addedReactions.map(Reaction => Reaction.reaction_ID);
                };

                results.target = "carousel";
                results.ID = ID;
                break;
            }
            case ("comment"): {
                const exsistingUserReactions = (await comment_reactions.findAll({ where: { [Op.and]: [{ user_ID: userID }, { comment_ID: ID }] } })).map(Reaction => Reaction.reaction_ID);

                filteredReactionIDs.forEach(reactionID => {
                    if (exsistingUserReactions.includes(reactionID)) {
                        exsistingReactionIDs.push(reactionID)
                    } else {
                        addList.push({ comment_ID: ID, reaction_ID: reactionID, user_ID: userID, date: Date.now() });
                    };
                });

                if (addList.length != 0) {
                    const addedReactions = await comment_reactions.bulkCreate(addList);

                    results.reaction_ids = addedReactions.map(Reaction => Reaction.reaction_ID);
                };

                results.target = "comment";
                results.ID = ID;
                break;
            }
            case ("thread"): {
                const exsistingUserReactions = (await thread_reactions.findAll({ where: { [Op.and]: [{ user_ID: userID }, { thread_ID: ID }] } })).map(Reaction => Reaction.reaction_ID);

                filteredReactionIDs.forEach(reactionID => {
                    if (exsistingUserReactions.includes(reactionID)) {
                        exsistingReactionIDs.push(reactionID)
                    } else {
                        addList.push({ thread_ID: ID, reaction_ID: reactionID, user_ID: userID, date: Date.now() });
                    };
                });

                if (addList.length != 0) {
                    const addedReactions = await thread_reactions.bulkCreate(addList);

                    results.reaction_ids = addedReactions.map(Reaction => Reaction.reaction_ID);
                };

                results.target = "thread";
                results.ID = ID;
                break;
            }
            case ("profile"): {
                const exsistingUserReactions = (await profile_reactions.findAll({ where: { [Op.and]: [{ user_ID: userID }, { profile_ID: ID }] } })).map(Reaction => Reaction.reaction_ID);

                filteredReactionIDs.forEach(reactionID => {
                    if (exsistingUserReactions.includes(reactionID)) {
                        exsistingReactionIDs.push(reactionID)
                    } else {
                        addList.push({ profile_ID: ID, reaction_ID: reactionID, user_ID: userID, date: Date.now() });
                    };
                });

                if (addList.length != 0) {
                    const addedReactions = await profile_reactions.bulkCreate(addList);

                    results.reaction_ids = addedReactions.map(Reaction => Reaction.reaction_ID);
                };

                results.target = "profile";
                results.ID = ID;
                break;
            }
            default: {
                throw new Error("invalid reation target was selected!");
            }
        };

        if (badReactionIDs.length != 0) {
            results.bad_reaction_ids = badReactionIDs;
        };

        if (exsistingReactionIDs.length != 0) {
            results.duplicate_reaction_ids = exsistingReactionIDs;
        };

        return res.status(200).json(results);

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

        const vaildReactionIDs = (await reaction.findAll({ attributes: ["ID"] })).map(Reaction => Reaction.ID);

        if (vaildReactionIDs.includes(reactionID)) {

            switch (target) {
                case ("media"): {
                    const targetReaction = await media_reactions.findOne({ where: { [Op.and]: [{ user_ID: userID }, { media_ID: ID }, { reaction_ID: reactionID }] } });

                    if (targetReaction) {
                        await targetReaction.destroy();
                        return res.status(200).json({ deleted: targetReaction.reaction_ID });
                    } else {
                        return res.status(400).json({ error: "user has no such reaction on target item" });
                    };

                }
                case ("story"): {
                    const targetReaction = await story_reactions.findOne({ where: { [Op.and]: [{ user_ID: userID }, { carousel_ID: ID }, { reaction_ID: reactionID }] } });

                    if (targetReaction) {
                        await targetReaction.destroy();
                        return res.status(200).json({ deleted: targetReaction.reaction_ID });
                    } else {
                        return res.status(400).json({ error: "user has no such reaction on target item" });
                    };

                }
                case ("comment"): {
                    const targetReaction = await comment_reactions.findOne({ where: { [Op.and]: [{ user_ID: userID }, { comment_ID: ID }, { reaction_ID: reactionID }] } });

                    if (targetReaction) {
                        await targetReaction.destroy();
                        return res.status(200).json({ deleted: targetReaction.reaction_ID });
                    } else {
                        return res.status(400).json({ error: "user has no such reaction on target item" });
                    };

                }
                case ("thread"): {
                    const targetReaction = await thread_reactions.findOne({ where: { [Op.and]: [{ user_ID: userID }, { thread_ID: ID }, { reaction_ID: reactionID }] } });

                    if (targetReaction) {
                        await targetReaction.destroy();
                        return res.status(200).json({ deleted: targetReaction.reaction_ID });
                    } else {
                        return res.status(400).json({ error: "user has no such reaction on target item" });
                    };

                }
                case ("profile"): {
                    const targetReaction = await profile_reactions.findOne({ where: { [Op.and]: [{ user_ID: userID }, { profile_ID: ID }, { reaction_ID: reactionID }] } });

                    if (targetReaction) {
                        await targetReaction.destroy();
                        return res.status(200).json({ deleted: targetReaction.reaction_ID });
                    } else {
                        return res.status(400).json({ error: "user has no such reaction on target item" });
                    };

                }
                default: {
                    throw new Error("an error occured while trying to remove a reaction isntance.");
                };
            };

        } else {
            return res.status(400).json({ error: `${reactionID} is not a vaild reaction ID` });
        };

    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};
