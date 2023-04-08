const friendController = require("../controllers/friends");
const auth = require("../middlewares/authentiaction/auth");
const userValidator = require("../middlewares/validators/user");
const router = require('express').Router();

// get all pending friends
router.get("/friends/pending", auth.isAuth, friendController.getPendingFriends);

// get all verified friends 
router.get("/friends/:userID", userValidator.checkIfUserIDExsits, friendController.getFriends);

// add friend
router.post("/friends/:userID/add", auth.isAuth, userValidator.checkIfUserIDExsits, friendController.requestFriend);

// confirm friend
router.post("/friends/:userID/confirm", auth.isAuth, userValidator.checkIfUserIDExsits, friendController.verifyFriend);

// remove friend
router.delete("/friends/:userID", auth.isAuth, userValidator.checkIfUserIDExsits, friendController.removeFrined);


module.exports = router;