const router = require('express').Router();
const auth = require("../middlewares/authentiaction/auth");
const userValidator = require("../middlewares/validators/user");
const followedController = require("../controllers/following");


// get follower count
router.get('following/count/:userID', userValidator.checkIfUserIDExsits, followedController.getFollowerCount);

// get all followed
router.get('following/all', auth.isAuth, followedController.getFollowedList);

// unsub
router.delete('following/:userID', auth.isAuth, userValidator.checkIfUserIDExsits, userValidator.checkIfNotSelf, followedController.unSub);

// sub
router.post('following/:userID', auth.isAuth, userValidator.checkIfUserIDExsits, userValidator.checkIfNotSelf, followedController.sub);

module.exports = router;