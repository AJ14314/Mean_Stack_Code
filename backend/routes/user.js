const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post("/signup", userController.createUser); //calling without brackets to passing just reference instead of executing

router.post('/login', userController.userLogin);

router.get('/:userid', userController.fetchUserProfile);

module.exports = router;