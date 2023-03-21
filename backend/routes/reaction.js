const router = require('express').Router();
const auth = require("../middlewares/authentiaction/auth");
const preporcess = require("../middlewares/preprocessors/common");
const threadValidator = require("../middlewares/validators/thread");
const userValidator = require("../middlewares/validators/user");
const mediaValidator = require("../middlewares/validators/media");
const storyValidator = require("../middlewares/validators/story");
const commonValidator = require("../middlewares/validators/common");
const reactionValidator = require("../middlewares/validators/reaction");
const commentValidator = require("../middlewares/validators/comment");
const reactionsController = require("../controllers/reactions");
const multer = require('multer');
const upload = multer({ storage: new multer.memoryStorage() });

//create new reaction type, TODO: admin only
//list all avalibe reaction types
router.route('/reaction').post(auth.isAuth, reactionValidator.reactionCheckIfNameConflicts, upload.single('image'), reactionValidator.validateNewReactionData, reactionValidator.createRules(), commonValidator.validate, reactionsController.createReaction)
    .get(reactionsController.getAllReactions);

//delete a reaction type ,TODO: admin only  
router.delete('/reaction/:reactionID', auth.isAuth, reactionValidator.checkIfReactionIDExsist, reactionsController.deleteReaction);


//add reaction to media ID
//remove reaction from media ID
router.route('/media/:mediaID/reaction').post(mediaValidator.checkIfMediaIDExsist, auth.isAuth, preporcess.setTargetType("media"), reactionsController.addReaction)
    .delete(mediaValidator.checkIfMediaIDExsist, auth.isAuth, preporcess.setTargetType("media"), reactionsController.removeReaction);

//add reaction to thread ID
//remove reaction from thread ID
router.route('/thread/:threadID/reaction').post(threadValidator.checkIfThreadExsits, auth.isAuth, preporcess.setTargetType("thread"), reactionsController.addReaction)
    .delete(threadValidator.checkIfThreadExsits, auth.isAuth, preporcess.setTargetType("thread"), reactionsController.removeReaction);

//add reaction to profile ID
//remove reaction from profile ID
router.route('/user/:userID/reaction').post(userValidator.checkIfUserIDExsits, auth.isAuth, preporcess.setTargetType("profile"), reactionsController.addReaction)
    .delete(userValidator.checkIfUserIDExsits, auth.isAuth, preporcess.setTargetType("profile"), reactionsController.removeReaction);

//add reaction to story ID
//remove reaction from story ID
router.route('/story/:storyID/reaction').post(storyValidator.checkIfStoryIDExsits, auth.isAuth, preporcess.setTargetType("story"), reactionsController.addReaction)
    .delete(storyValidator.checkIfStoryIDExsits, auth.isAuth, preporcess.setTargetType("story"), reactionsController.removeReaction);

//add reaction to comment ID
//remove reaction from comment ID
router.route('/comment/:commentID/reaction').post(commentValidator.checkIfCommentIDExsist, auth.isAuth, preporcess.setTargetType("comment"), reactionsController.addReaction)
    .delete(commentValidator.checkIfCommentIDExsist, auth.isAuth, preporcess.setTargetType("comment"), reactionsController.removeReaction);

module.exports = router;