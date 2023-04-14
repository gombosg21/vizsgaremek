const router = require('express').Router();
const commentController = require('../controllers/comment');
const commentValidator = require('../middlewares/validators/comment');
const threadValidator = require('../middlewares/validators/thread');
const commonValidator = require("../middlewares/validators/common");
const auth = require("../middlewares/authentiaction/auth");
const ownership = require("../middlewares/authentiaction/ownership");

// on thread
// create comment
router.post('/thread/:threadID/comment', auth.isAuth, threadValidator.checkIfThreadExsits, commentValidator.commentRules(), commonValidator.validate, commentController.createComment);

// edit comment
// delete comment
// get
router.route('/comment/:commentID')
    .patch(commentValidator.checkIfCommentIDExsist, auth.isAuth, ownership.isMyComment, commentValidator.commentRules(), commonValidator.validate, commentController.editComment)
    .delete(commentValidator.checkIfCommentIDExsist, auth.isAuth, ownership.isMyComment, commentController.deleteComment)
    .get(commentValidator.checkIfCommentIDExsist, auth.optionalAuth, commentController.getComment);
module.exports = router;