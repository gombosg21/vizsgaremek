const router = require('express').Router();
const auth = require("../middlewares/authentiaction/auth");
const ownership = require("../middlewares/authentiaction/ownership");
const threadController = require("../controllers/thread");
const preporcess = require("../middlewares/preprocessors/thread");
const threadValidator = require("../middlewares/validators/thread");
const userValidator = require("../middlewares/validators/user");
const mediaValidator = require("../middlewares/validators/media");
// const storyValidator = require("../middlewares/validators/story");
const commonValidator = require("../middlewares/validators/common");

// create on story_id
router.post('/story/:story_D/thread', auth.isAuth, threadValidator.createThreadRules(), commonValidator.validate, preporcess.setCreateTargetType("story"), threadController.CreateThread)

// create on profile_id
router.post('/user/:userID/thread', auth.isAuth, userValidator.checkIfUserIDExsits, threadValidator.createThreadRules(), commonValidator.validate, preporcess.setCreateTargetType("user"), threadController.CreateThread)

// create on media_id
router.post('/media/:media_D/thread', auth.isAuth, mediaValidator.checkIfMediaIDExsist, threadValidator.createThreadRules(), commonValidator.validate, preporcess.setCreateTargetType("media"), threadController.CreateThread)

router.get('/thread/all', threadController.getAllThreads)

// by thread ID
// view
// delete
router.route('/thread/:threadID')
    .get(threadValidator.checkIfThreadExsits, threadController.getThread)
    .patch(threadValidator.checkIfThreadExsits, auth.isAuth, ownership.isMyThread, threadValidator.editThreadRules(), commonValidator.validate, threadController.editThread)
    .delete(threadValidator.checkIfThreadExsits, auth.isAuth, ownership.isMyThread, threadController.deleteTread)

// search threads by params name, creation date, creater name
router.get('/thread/search', threadValidator.searchThreadRules(), commonValidator.validate, threadController.searchThreads)

module.exports = router;