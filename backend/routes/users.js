const router = require('express').Router();
const userController = require('../controllers/user');
const userValidator = require('../middlewares/validators/user');
const commonValidation = require('../middlewares/validators/common');
const auth = require('../middlewares/authentiaction/auth');
const passport = require('passport');

// get login
router.get('/user/login', passport.authenticate('local',{failureRedirect:'/api/v/0.1/'}), userController.login);

// get logout
router.get('/user/logout', userController.logout);

// post create user
router.post('/user/register', userValidator.checkIfNameConflicts, userValidator.registerRules(), commonValidation.validate,userController.createUser);

// get profile
router.get('/user/:userID', userValidator.checkIfUserIDExsits, userController.getProfile);

// edit profile
// delete user
router.route('/user/')
    .patch(auth.isAuth, userValidator.updateProfileRules(), commonValidation.validate, userController.editProfile)
    .delete(auth.isAuth,userController.deleteUser);

// get reset password
router.get('/user/reset-password/', userController.resetPassword);


// patch change password
router.patch('/user/change-password', auth.isAuth,userValidator.changePasswordRules() ,commonValidation.validate ,userController.changePassword);

// patch change user register data
// router.patch('/user/register/:userID')

// get search user by params name, birthdate, gender
router.get('/user',userValidator.searchRules(),commonValidation.validate,userController.findUser)

module.exports = router;