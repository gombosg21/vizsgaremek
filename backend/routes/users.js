const router = require('express').Router();
const userController = require('../controllers/user');
const userValidator = require('../middlewares/validators/user');

// get user, for testing now
router.get('/user/:userID',userValidator.checkIfUserIDExsits,userController.getUser);

//get profile
router.get('/user/:userID/profile',userValidator.checkIfUserIDExsits,userController.getProfile)

// get login
router.get('/user/:name/login',userValidator.checkIfNameExsist,userController.login);

// get logout
router.get('/user/:userID/logout',userValidator.checkIfUserIDExsits,userController.logout)

// get reset password
router.get('/user/:name/password-reset',userValidator.checkIfNameExsist,userController.resetPassword);

// post create user
router.post('/user/register',userValidator.checkIfNameConflicts,userValidator.registerRules,userValidator.validateRegistration,userController.createUser);

// patch edit profile
router.patch('/user/:userID/profile/edit',userValidator.checkIfUserIDExsits,userController.editProfile);

// patch change password
router.patch('/user/:userID/change-password',userValidator.checkIfUserIDExsits,userController.changePassword);

// patch change user register data
router.patch('/user/:userID/register/edit')

// delete delete user
router.delete('/user/:userID',userValidator.checkIfUserIDExsits,userController.deleteUser);

// patch add reaction

module.exports = router;