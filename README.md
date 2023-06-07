A Node.js REST API built with Express.js and MongoDB. The server allows CRUD operations for users and blogs. 

The database contains two collections: ```users``` and ```posts```. 

The ```users``` collection contains information about users, such as their name, email address, and password. 

The ```posts``` collection contains information about posts, such as the title, body, and author.

The server is also configured to use a middleware that provides basic authentication.

Reading and upvoting blogs are open to all users, while creating, updating, and deleting blogs require authentication. 

API Routes
Authentication Routes

    POST /auth/signup - Sign up a user.
    POST /auth/signin - Sign in a user.

User Routes

    GET /user - Get all users (authentication required).
    GET /user/:userID - Get a single user by ID (authentication required).
    PATCH /updateuser/:userID - Update a user by ID (authentication required).
    DELETE /deleteuser/:userID - Delete a user by ID (authentication required).

Blog Routes

    GET /blog - Get all blog posts.
    GET /blog/:postID - Get a single blog post by ID.
    POST /createblogpost - Create a new blog post (authentication required).
    PATCH /updateblogpost/:postID - Update a blog post by ID (authentication and access required).
    PATCH /upvoteblogpost/:postID - Upvote a blog post.
    DELETE /deleteblogpost/:postID - Delete a blog post by ID (authentication and access required).
