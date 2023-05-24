// import express
const express = require('express'); 
const router = express.Router(); 

// import route controller
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// connect routes to controller
router.get('/user', authController.authenticateTokenAndAdmin, userController.allUsers);
router.get('/user/:userID', authController.authenticateTokenAndAdmin, userController.singleUser);
router.patch('/updateuser/:userID', authController.authenticateTokenAndAdmin, userController.updateUser);
router.delete('/deleteuser/:userID', authController.authenticateTokenAndAdmin, userController.deleteUser);

 
module.exports = router; 