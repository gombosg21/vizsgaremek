const comment = require('../models').comment;
const user = require('../models').user;
const thread = require('../models').thread;
const profile = require("../models").profile;
const comment_reactions = require("../models").comment_reactionlist;
const { fn, col } = require('sequelize');

exports.getComment = async (req, res, next) => {
    const commentID = req.params.commentID;

    try {
        const Comment = await comment.findByPk(commentID,
            {
                attributes: ['content', 'ID', 'created', 'last_edit'],
                include: [
                    {
                        model: user,
                        attributes: ['ID'],
                        include: [{ model: profile, attributes: ['alias'] }]
                    },
                    {
                        model: thread,
                        attributes: ['ID']
                    },
                ]
            });

        const reactions = await comment_reactions.findAll({
            where: { comment_ID: commentID },
            attributes: [['reaction_ID', 'ID'], "comment_ID", [fn('COUNT', 'reaction_ID'), 'count']],
            group: [col('reaction_ID')]
        });

        Comment.dataValues.reactions = reactions;

        return res.status(200)
            .json(Comment);
    } catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.createComment = async (req, res, next) => {
    const userID = req.user.ID;
    const threadID = req.params.threadID;
    const commentData = req.body.content;

    try {
        const Comment = await comment.create({
            user_ID: userID,
            thread_ID: threadID,
            content: commentData
        });

        const Thread = await thread.findByPk(threadID);
        await Thread.update({ last_activity: Comment.created });
        return res.status(200).json(Comment);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.editComment = async (req, res, next) => {
    const commentID = req.params.commentID;
    const commentData = req.body.content;

    try {
        const Comment = await comment.findByPk(commentID, {
            attributes: ['content', 'ID', 'created', 'last_edit', 'thread_ID'],
            include: [
                {
                    model: user,
                    attributes: ['ID'],
                    include: [{ model: profile, attributes: ['alias'] }]
                }
            ]
        });

        const reactions = await comment_reactions.findAll({
            where: { comment_ID: commentID },
            attributes: [['reaction_ID', 'ID'], "comment_ID", [fn('COUNT', 'reaction_ID'), 'count']],
            group: [col('reaction_ID')]
        });

        Comment.dataValues.reactions = reactions;

        Comment.update({
            content: commentData,
            last_edit: Date.now()
        });
        Comment.save();
        const Thread = await thread.findByPk(Comment.thread_ID);
        await Thread.update({ last_activity: Comment.last_edit });
        return res.status(200).
            json(Comment);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};

exports.deleteComment = async (req, res, next) => {
    const commentID = req.params.commentID;

    try {
        const Comment = await comment.findByPk(commentID);
        const Thread = await thread.findByPk(Comment.thread_ID);
        await Thread.update({ last_activity: Date.now() });
        await Comment.destroy();

        return res.status(200).json({ ID: Comment.ID });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};