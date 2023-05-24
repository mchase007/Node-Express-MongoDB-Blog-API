const Blog = require('../models/blogModel');
const User = require('../models/userModel');
 
// get all blog posts
const allBlogPosts = async (req, res) => {
  try {
    const blogs = await Blog.find();
    // Blog.find().sort({ createdAt: 'desc' });

    let blogData = []

    await blogs.forEach(blog => {
      let actualBlog = blog._doc

      blogData.push(actualBlog)
    });
 
    await res.status(200).json(blogData); 
    
    console.log('Fetched all blog posts');
  } catch (error) {
    console.log(error);
  }
}; 

// get single blog post
const singleBlogPost = async (req, res) => {
  try {
    const blog = await Blog.findById({"_id" : req.params.postID})
    .populate(
      {
        path: 'blogPostAuthor',
        model: 'User',
        select: 'userName'
      }
      )
    if (!blog) {
      return res.json(
        {
          status: 404,
          error: 'Blog post was not found'
        }
      ) 
    }
    
    let actualBlog = blog._doc
    res.json(
      {
        status: 200,
        svrMessage: 'Success',
        actualBlog,    
      }
    );
  } catch (error) {
    res.json(error);
  }
};

// create a new blog post
const createBlogPost = async (req, res) => {

  const blog = new Blog({
    blogPostTitle: req.body.blogPostTitle,
    blogPostAuthor: req.user._id,
    blogPostContent: req.body.blogPostContent,
    blogPostTags: req.body.blogPostTags,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
  });

  try {
    const savedBlog = await blog.save();
    res.json({
      status: 201,
      svrMessage: 'Success',
      content: savedBlog,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ 
        status: 'error',
        error: 'There is an existing blog post with the same title.',
        svrMessage: 'Duplicate'
    })
    } else {
      res.json({message: err});
    }
  }
};

// update an existing blog post
const updateBlogPost = async (req, res) => {

  let postID = req.params.postID;
  let postObj = req.body;

  let updateObj = {}
    
  const postKeys = Object.keys(postObj);
  postKeys.forEach((key, index) => {
    if (postObj[key].length >= 1) {
      updateObj[key] = postObj[key]
    }
  });

  
  try {
    const updatedBlogPost = await Blog.updateOne({ _id: postID }, { $set: updateObj });

    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({
      svrMessage: 'Success',
      content: updatedBlogPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }

    

};

// upvote a blog post
const upvoteBlogPost = async (req, res) => {
  try {
    const blog = await Blog.findById({"_id" : req.params.postID});
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    blog.blogPostUpvote += 1;
    const savedBlog = await blog.save();

    if (!savedBlog) {
      return res.status(500).json({ error: 'Error saving blog post' });
    }
    
    res.status(200).json({ 
      svrMessage: 'Success', 
      content: savedBlog._doc
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// delete a blog post
const deleteBlogPost = async (req, res) => {

  let postID = req.params.postID;

  try {
    const blog = await Blog.findByIdAndDelete(postID)

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json({ 
      svrMessage: 'Success', 
      content: 'Post Deleted'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

};

module.exports = {
  allBlogPosts,
  singleBlogPost,
  createBlogPost,
  updateBlogPost,
  upvoteBlogPost,
  deleteBlogPost 
}