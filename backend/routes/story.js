const router = require('express').Router();
const auth = require('../middlewares/authentiaction/auth');
const ownership = require('../middlewares/authentiaction/ownership');
const storyController = require('../controllers/story');
const storyValidator = require('../middlewares/validators/story');
const validate = require('../middlewares/validators/common').validate;
const userValidator = require('../middlewares/validators/user');


// create story
// TODO verify mediaID
router.post('/story', auth.isAuth, storyValidator.createStoryRules(), validate, storyController.createStory);

//get all stories from user

router.get('/story/user/:userID/all', userValidator.checkIfUserIDExsits, storyController.getAllStoryFromUser);

// edit story
// TODO verify mediaID
// get story
// delete story
router.route('/story/:storyID')
    .get(storyValidator.checkIfStoryIDExsits, storyController.getStory)
    .patch(storyValidator.checkIfStoryIDExsits, auth.isAuth, ownership.isMyStory, storyController.editStory)
    .delete(storyValidator.checkIfStoryIDExsits, auth.isAuth, ownership.isMyStory, storyController.deleteStory);


module.exports = router;