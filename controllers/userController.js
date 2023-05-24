const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");

// get all users
const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Blog.find().sort({ createdAt: 'desc' });

    let userData = []

    await users.forEach(user => {
      let actualUser = user._doc
      delete actualUser.userPassword

      userData.push(actualUser)
    });
 
    await res.json(userData); 
    
    console.log('Fetched all users');
  } catch (error) {
    console.log(error);
  }
};

// get a single user
const singleUser = async (req, res) => {
  try {
    const user = await User.findById({"_id" : req.params.userID});
    if (!user) {
      return res.json(
        {
          status: 404,
          error: 'User was not found'
        }
      ) 
    }
    
    const { userPassword, ...others } = user._doc

    res.json(
      {
        status: 200,
        svrMessage: 'Success',
        content: others,    
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// update a user
const updateUser = async (req, res) => {
  let userID = req.params.userID;
  let userObj = req.body;

  let updateObj = {}
  
  const userKeys = Object.keys(userObj);
  userKeys.forEach((key, index) => {
    if (userObj[key].length >= 1) {
      updateObj[key] = userObj[key]
    }
  });

  if(updateObj.userPassword) {
    updateObj.userPassword = await bcrypt.hash(updateObj.userPassword, 10);
  }
  
  try {
    const updatedUser = await User.updateOne({ _id: userID }, { $set: updateObj });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    delete updatedUser.userPassword

    res.status(200).json({
      svrMessage: 'Success',
      content: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
  
};

// delete a user
const deleteUser = async (req, res) => {

  let userID = req.params.userID;

  try {
    const user = await User.findByIdAndDelete(userID)

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
      svrMessage: 'Success', 
      content: 'User Deleted'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

};


module.exports = {
  allUsers,
  singleUser,
  updateUser,
  deleteUser,
}