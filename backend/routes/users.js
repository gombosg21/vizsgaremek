const router = require('express').Router();
const userController = require('../controllers/user');
const userValidator = require('../middlewares/validators/user');
const commonValidation = require('../middlewares/validators/common');
const passport = require('passport');

// get profile
// edit profile
// delete user
router.route('/user/:userID')
    .get( userValidator.checkIfUserIDExsits, userController.getProfile)
    .patch(userValidator.checkIfUserIDExsits, userValidator.updateProfileRules(), commonValidation.validate, userController.editProfile)
    .delete( userValidator.checkIfUserIDExsits, userController.deleteUser);

// get login
router.get('/user/login', passport.authenticate('local'), userController.login);

// get logout
router.get('/user/logout', userController.logout)

// get reset password
router.get('/user/reset-password', userController.resetPassword);

// post create user
router.post('/user/register', userValidator.checkIfNameConflicts, userValidator.registerRules(), commonValidation.validate, userController.createUser);

// patch change password
router.patch('/user/change-password', userValidator.changePasswordRules() ,commonValidation.validate ,userController.changePassword);

// patch change user register data
router.patch('/user/register/:userID')

// get search user by params name, birthdate, gender
router.get('/user',userValidator.searchRules(),commonValidation.validate,userController.findUser)

module.exports = router;