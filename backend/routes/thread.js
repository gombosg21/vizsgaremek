const router = require('express').Router();
const auth = require("../middlewares/authentiaction/auth");
const ownership = require("../middlewares/authentiaction/ownership");
const threadController = require("../controllers/thread");
const preporcess = require("../middlewares/preprocessors/thread")

// create on story_id
router.post('/story/:ID/thread', auth.isAuth, preporcess.setCreateTargetType("story"),threadController.CreateThread)

// create on profile_id
router.post('/user/:ID/thread', auth.isAuth, preporcess.setCreateTargetType("user"),threadController.CreateThread)

// create on media_id
router.post('/media/:ID/thread', auth.isAuth, preporcess.setCreateTargetType("media"),threadController.CreateThread)

router.get('/thread/all',threadController.getAllThreads)

// by thread ID
// view
// delete
router.route('/thread/:ID')
    .get(threadController.getThread)
    .patch(auth.isAuth, threadController.editThread)
    .delete(auth.isAuth, threadController.deleteTread)

// search threads by params name, creation date, creater name
router.get('/thread/search?',)

module.exports = router;