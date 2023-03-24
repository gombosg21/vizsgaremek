const comment = require('../models').comment;
const user = require('../models').user;
const thread = require('../models').thread;

exports.getComment = async (req, res, next) => {
    const commentID = req.params.commentID;

    try {
        const Comment = await comment.findByPk(commentID, { attributes: ['ID', 'content'], include: [{ model: user, attributes: ['ID', 'alias'] }, { model: thread, attributes: ['ID', 'name'] }] });

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
        const Comment = await comment.build({
            user_ID: userID,
            thread_ID: threadID,
            content: commentData
        });
        await Comment.save();
        return res.status(200).json({ ID: Comment.ID });
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
        const Comment = await comment.findByPk(commentID);

        Comment.update({
            content: commentData,
            last_edit: Date.now()
        });
        Comment.save();
        return res.status(200).
            json({
                ID: Comment.ID,
                content: Comment.content,
                last_edit: Comment.last_edit
            });
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
        await Comment.destroy();
        return res.status(200)
            .json({ ID: Comment.ID });
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    };
};