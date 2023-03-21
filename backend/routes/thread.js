const router = require('express').Router();
const auth = require("../middlewares/authentiaction/auth");
const ownership = require("../middlewares/authentiaction/ownership");
const threadController = require("../controllers/thread");
const preporcess = require("../middlewares/preprocessors/common");
const threadValidator = require("../middlewares/validators/thread");
// const userValidator = require("../middlewares/validators/user");
const mediaValidator = require("../middlewares/validators/media");
const storyValidator = require("../middlewares/validators/story");
const commonValidator = require("../middlewares/validators/common");

// create on story_id
router.post('/story/:storyID/thread', auth.isAuth, storyValidator.checkIfStoryIDExsits, threadValidator.createThreadRules(), commonValidator.validate, preporcess.setTargetType("story"), threadController.CreateThread);

// create on profile_id
// not used
// router.post('/user/:userID/thread', auth.isAuth, userValidator.checkIfUserIDExsits, threadValidator.createThreadRules(), commonValidator.validate, preporcess.setTargetType("profile"), threadController.CreateThread);

// create on media_id
router.post('/media/:mediaID/thread', auth.isAuth, mediaValidator.checkIfMediaIDExsist, threadValidator.createThreadRules(), commonValidator.validate, preporcess.setTargetType("media"), threadController.CreateThread);

//list all threads
router.get('/thread/all', threadController.getAllThreads);

// by thread ID
// view
// delete
router.route('/thread/:threadID')
    .get(threadValidator.checkIfThreadExsits, threadController.getThread)
    .patch(threadValidator.checkIfThreadExsits, auth.isAuth, ownership.isMyThread, threadValidator.editThreadRules(), commonValidator.validate, threadController.editThread)
    .delete(threadValidator.checkIfThreadExsits, auth.isAuth, ownership.isMyThread, threadController.deleteTread);

// search threads by params name, creation date, creater name and thread comment contents
router.get('/thread/search', threadValidator.searchThreadRules(), commonValidator.validate, threadController.searchThreads);

module.exports = router;