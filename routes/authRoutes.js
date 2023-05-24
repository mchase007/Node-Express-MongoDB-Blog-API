// import express
const express = require('express'); 
const router = express.Router();

// import route controller
const authController = require('../controllers/authController');

// connect routes to controller
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
 
 
module.exports = router;