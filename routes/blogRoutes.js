const express = require("express");
const multer = require("multer");
const {
  createBlog,
  getBlogs,
  getBlogById,
  getUserBlogs, // New function for fetching blogs by the logged-in user
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save uploaded files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Save file with a unique name
  },
});
const upload = multer({ storage });

// Route for creating a blog with image upload (requires authentication)
router.post("/create", authMiddleware, upload.single("image"), createBlog);

// Route for getting all blogs
router.get("/", getBlogs);

// Route for getting all blogs created by the logged-in user (requires authentication)
router.get("/user", authMiddleware, getUserBlogs);

// Route for getting a single blog by ID
router.get("/:id", getBlogById);

// Route for updating a blog by ID (requires authentication)
router.put("/:id", authMiddleware, updateBlog);

// Route for deleting a blog by ID (requires authentication)
router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;
