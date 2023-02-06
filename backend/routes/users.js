const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

module.exports = router;

// get user, for testing now
router.get('/user/:ID',userController.getUser);

//get profile
router.get('/user/:ID/profile')

// get login
router.get('/user/:name/login',userController.login);

// get logout
router.get('/user/:ID/logout',)

// get reset password
router.get('/user/:name/password-reset',userController.resetPassword);

// post create user
router.post('/user/register',userController.createUser);

// patch edit profile
router.patch('/user/:ID/profile/edit');

// patch change password
router.patch('/user/:ID/change-password',);

// patch change user register data
router.patch('/user/:ID/register/edit')

// delete delete user
router.delete('/user/:ID',userController.deleteUser);

// patch add reaction
