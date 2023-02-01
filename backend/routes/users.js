const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

module.exports = router;

// get user

router.get('user/:ID',userController.getUser());

// get login

router.get('user/:name/login',userController.login());

// put reset password

router.get('user/:name/password-reset',userController.resetPassword());

// post create user

router.post('user/',userController.createUser());

// delete delete user

router.delete('user/:id',userController.deleteUser());
