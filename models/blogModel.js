// import mongodb(database) package
const mongoose = require('mongoose');

// define fields of schema
const BlogPostSchema = mongoose.Schema({
  blogPostTitle: {
    type: String,
    required: true,
    unique: true
  }, 
  blogPostAuthor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  blogPostContent: {
    type: String,
    required: true
  },
  blogPostUpvote: {
    type: Number,
    default: 0
  },
  blogPostTags: {
    type: [String],
    default: []
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
const blogPost = mongoose.model('blogPost', BlogPostSchema);
module.exports = blogPost;