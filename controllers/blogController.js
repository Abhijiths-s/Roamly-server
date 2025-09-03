const Blog = require("../models/Blog");

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    // Get the blog data from the request body
    const { title, content, author } = req.body;

    // Get the image data from the uploaded file
    const image = req.file ? req.file.filename : null; // Assuming image is stored using multer's filename field

    // Create a new blog post
    const blog = new Blog({
      title,
      content,
      author: req.user.id, // Set the author to the logged-in user's ID
      image: image, // Store the image filename in the database
    });

    // Save the blog to the database
    await blog.save();

    // Respond with the created blog post
    res.status(201).json(blog);
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({ message: "Error creating blog", error });
  }
};

// Get all blog posts
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username"); // Populate author details if needed
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// Get all blog posts by the logged-in user

exports.getUserBlogs = async (req, res) => {
  try {
    // console.log("Request user:", req.user);
    const userId = req.user.id; // This should be the logged-in user's ID
    // console.log("User ID for blog retrieval:", userId); 

    const userBlogs = await Blog.find({ author: userId }); // Query based on author

    if (!userBlogs.length) {
      return res.status(200).json([]);
    }

    res.status(200).json(userBlogs);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
};

// Update a blog post by ID (only by author)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the user is the author of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    // Update the blog
    Object.assign(blog, req.body);
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// Delete a blog post by ID (only by author)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the user is the author of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    const userId = req.user.id;
    const liked = blog.likes.includes(userId);

    if (liked) {
      // If already liked, remove the like
      blog.likes.pull(userId);
    } else {
      // If not liked, add the like
      blog.likes.push(userId);
    }

    await blog.save();
    res.status(200).json({ likes: blog.likes.length, liked: !liked });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error });
  }
};

exports.addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = {
      user: req.user.id,
      text: req.body.text,
    };
    blog.comments.push(comment);
    await blog.save();
    res.status(201).json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

exports.getComments = async (req, res) => { 
  try {
    const blog = await Blog.findById(req.params.id).populate("comments.user", "username");
    if (!blog) return res.status(404).json({ message: "Blog not found" });  
    res.status(200).json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  } 
};