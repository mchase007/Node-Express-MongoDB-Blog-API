// import express
const express = require('express'); 
const router = express.Router();

// import route controller
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');

// connect routes to controller 
router.get('/blog', blogController.allBlogPosts);
router.get('/blog/:postID', blogController.singleBlogPost);
router.post('/createblogpost', authController.authenticateToken, blogController.createBlogPost);
router.patch('/updateblogpost/:postID', authController.authenticateTokenAndAccess, blogController.updateBlogPost);
router.patch('/upvoteblogpost/:postID', blogController.upvoteBlogPost);
router.delete('/deleteblogpost/:postID', authController.authenticateTokenAndAccess, blogController.deleteBlogPost);
 
module.exports = router; 