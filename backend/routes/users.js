const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

module.exports = router;

// get user, will return all if logged in as :ID else only a view of it

router.get('user/:ID',userController.getUser);

// get login

router.get('user/:name/login',userController.login);

// get reset password

router.get('user/:name/password-reset',userController.resetPassword);

// post create user

router.post('user/',userController.createUser);

// patch edit profile

// patch change password

// put change user register data

// delete delete user

router.delete('user/:id',userController.deleteUser);
