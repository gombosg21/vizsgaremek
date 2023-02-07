const router = require('express').Router();
const userController = require('../controllers/user');
const userValidator = require('../middlewares/validators/user');

// get profile
// edit profile
// delete user
router.route('/user/:userID')
    .get( userValidator.checkIfUserIDExsits, userController.getProfile)
    .patch(userValidator.checkIfUserIDExsits, userController.editProfile)
    .delete( userValidator.checkIfUserIDExsits, userController.deleteUser);

// get login
router.get('/user/:name/login', userValidator.checkIfNameExsist, userController.login);

// get logout
router.get('/user/:userID/logout', userValidator.checkIfUserIDExsits, userController.logout)

// get reset password
router.get('/user/:name/password-reset', userValidator.checkIfNameExsist, userController.resetPassword);

// post create user
router.post('/user/register', userValidator.checkIfNameConflicts, userValidator.registerRules(), userValidator.validateRegistration, userController.createUser);

// patch change password
router.patch('/user/:userID/change-password', userValidator.checkIfUserIDExsits, userController.changePassword);

// patch change user register data
router.patch('/user/:userID/register/edit')

// get search user by params name, birthdate, gender
router.get('/user/search/:name.:date.:gender')

module.exports = router;