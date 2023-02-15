const comment = require('../models').comment;
const thread = require('../models').thread;

exports.createComment = async (req, res, next) => {
    const userID = "";
    const threadID = req.params.thread_ID;
    const commentData = req.body.comment_text;

    try {
        const Comment = comment.build({
            user_Id: userID,
            thread_ID: threadID,
            content: commentData
        });
        Comment.save();
        res.status(200);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
}

exports.editComment = async (req, res, next) => {
    const threadId = req.params.thread_ID;
    const commentID = req.params.comment_ID;
    const commentData = req.body.comment_text;

    try {
        const Comment = await comment.findOne({ where: { ID: commentID } });

        Comment.set({
            content: commentData
        });
        Comment.save();
        res.status(200).
            json(Comment);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
}

exports.deleteComment = async (req, res, next) => {

    const commentID = req.params.comment_ID;

    try {
        const Comment = await comment.findOne({ where: { ID: commentID } });
        await Comment.destroy();
        res.status(200)
            .json(Comment.ID);
    }
    catch (error) {
        console.error(error);
        res.status(500);
    }
}