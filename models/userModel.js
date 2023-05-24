// import mongodb(database) package
const mongoose = require('mongoose');

// define fields of schema
const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true
  },
  userPassword: {
    type: String,
    required: true
  },
  userAdminStatus: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date,
    default: Date.now
  },
  updatedAt: {  
    type: Date,
    default: Date.now
  }
});


// export db schema
const User = mongoose.model('User', userSchema);
module.exports = User;