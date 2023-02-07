const router = require('express').Router();
const threadController = reuqire("../controllers/thread");

// create on story_id
router.post('/story/:ID/thread',)

// create on profile_id
router.post('/user/:ID/thread',)

// create on media_id
router.post('/media/:ID/thread',)

// by thread ID
// view
// delete
router.route('/thread/:ID')
.get(threadController.getThread)
.patch(threadController.editThread)
.delete(threadController.deleteTread)

// search threads by params name, creation date, creater name
router.get('/thread/search/:name.:date.:user')

module.exports = router;