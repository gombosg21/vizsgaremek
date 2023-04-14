const router = require('express').Router();
const auth = require('../middlewares/authentiaction/auth');
const ownership = require('../middlewares/authentiaction/ownership');
const storyController = require('../controllers/story');
const storyValidator = require('../middlewares/validators/story');
const validate = require('../middlewares/validators/common').validate;
const userValidator = require('../middlewares/validators/user');


// create story
router.post('/story', auth.isAuth, storyValidator.createStoryRules(), validate, storyController.createStory);

//get all stories from user
router.get('/story/user/:userID/all', userValidator.checkIfUserIDExsits, auth.optionalAuth, storyController.getAllStoryFromUser);

// edit story
// get story
// delete story
router.route('/story/:storyID')
    .get(storyValidator.checkIfStoryIDExsits, auth.optionalAuth, storyController.getStory)
    .patch(storyValidator.checkIfStoryIDExsits, auth.isAuth, ownership.isMyStory, storyValidator.editStoryRules(), validate, storyController.editStory)
    .delete(storyValidator.checkIfStoryIDExsits, auth.isAuth, ownership.isMyStory, storyController.deleteStory);

//search story by query params
router.get('/story', storyValidator.searchStoryRules(), validate, auth.optionalAuth, storyController.searchStory);


module.exports = router;