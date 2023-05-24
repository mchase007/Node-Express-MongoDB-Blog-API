const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../models/userModel');
const Blog = require('../models/blogModel');
 
// create a new user
const signUp = async (req, res) => {
  let userName = req.body.userName;
  let userEmail = req.body.userEmail;
  let userPassword = req.body.userPassword; 

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(userPassword, 10);

  const user = new User ({
    userName,
    userEmail,
    userPassword: hashedPassword
  }); 

  try {
    const newUser = await user.save();
    const { userPassword, userAdminStatus, ...others } = newUser._doc
    res.json(
      {
        status: 201,
        svrMessage: 'Success',
        content: others,
      }
      );
  } catch (error) {
      if (error.code === 11000) {
        return res.json({ 
          status: 'error',
          error: 'Username already in use',
          svrMessage: 'Duplicate',
        })
      } else {
          throw res.json({message: error});
      }
  }
};

// sign in existing user
const signIn = async (req, res) => {
  let userName = req.body.userName;
  let userEmail = req.body.userEmail;
  let userPassword = req.body.userPassword;

  try {
    const user = await User.findOne({ $or: [{ userName }, { userEmail }] });

    if (!user) {
      //res.redirect('/signin')
      return res.json(
        {
          status: 'error',
          error: 'Invalid username or email'
        }
      )
    }

    if (await bcrypt.compare(userPassword, user.userPassword)) {
      const token = JWT.sign(
        {
          id: user._id,
          userName: user.userName,
          userEmail: user.userEmail,
          userAdminStatus: user.userAdminStatus,
        }, process.env.JWT_SECRET,
        {
          expiresIn: "12h"
        })

      const { userPassword, userAdminStatus, ...others } = user._doc

      if (user.userAdminStatus === true) {
        return res.json({
          Authorization: token,
          status: 200,
          svrMessage: 'Success',
          admin: true,
          content: others
        }) 
      } else {
          return res.json({
          Authorization: token,
          status: 200,
          svrMessage: 'Success',
          content: others
        });
      }
        
    } else {
          return res.json({status: 'error', error: 'Invalid password'})
        }
    } catch (error) {
        return res.json({ 
          status: 'error',
          error: error.message
        })
      }
};

// verify user's access to general resources
async function authenticateToken(req, res, next) { 
  const headerToken = req.headers.token
  if (!headerToken) {
    res.status(401).send('Access Denied. No token present.');
  } 
  
  try {
    const token = req.headers.token.split(' ')[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!decoded) {
      return res.status(403).json("Authentication failed. Token is not valid!");
    }

    if (!user) {
      return res.status(401).json('Authentication failed. User not found.');
    }
    const { userPassword, ...others } = user._doc
    req.user = others;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentication failed. Invalid Access Token' });
  }
 
};

// verify user and check access to a blog post
async function authenticateTokenAndAccess(req, res, next) {
  try {
    const blog = await Blog.findById({"_id" : req.params.postID});
      if (!blog) {
        return res.json(
          {
            status: 404,
            error: 'Blog post was not found'
          }
        ) 
      }

      let blogAuthor = blog._doc.blogPostAuthor

      authenticateToken(req, res, () => {

        if (req.user._id == blogAuthor || req.user.userAdminStatus === true) {
          next()
        } else {
          res.status(403).json(`Access Denied.`)
        }
      })
  } catch (error) {
      res.json(error)
  }
};

// verify user and admin privilege
async function authenticateTokenAndAdmin(req, res, next) {
  try {
      authenticateToken(req, res, () => {
        if (req.user.userAdminStatus === true) {
          next()
        } else {
          res.status(403).json(`Access Denied.`)
        }
      })
  } catch (error) {
      res.json(error)
  }
};   

module.exports = {
  signUp,
  signIn,
  authenticateToken,
  authenticateTokenAndAccess,
  authenticateTokenAndAdmin,
}