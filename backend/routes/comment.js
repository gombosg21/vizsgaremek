const router = require('express').Router();
const commentController = require('../controllers/comment');

// on thread
// create comment
// edit comment
// delete comment
router.route('/thread/:thread_ID/comment/:comment_ID')
    .post(commentController.createComment)
    .patch(commentController.editComment)
    .delete(commentController.deleteComment);

module.exports = router;