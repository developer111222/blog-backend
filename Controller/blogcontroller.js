const Blog = require("../Model/blogmodel");

//------create blog-----------
exports.createBlog = async (req, res, next) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if req.user exists (assuming you have authentication middleware)
    const user = req.user._id; // Access the authenticated user
    console.log(user,req.body,image)

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Create new blog with the authenticated user's ID
        const newBlog = new Blog({
            title,
            description:content,
            image,
            user: user // or user.id depending on your schema
        });
        console.log(newBlog);

        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully" });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server error while creating blog" });
    }
};

//------get all blogs-----------
exports.getBlogs = async (req, res, next) => {
    try {
        // Fetch blogs and populate the 'user' field with 'name' and 'email' from the User model
        const blogs = await Blog.find().populate('user', 'name email'); // Replace 'name email' with the fields you want to retrieve

        res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server error while fetching blogs" });
    }
};

//------get single blog-----------
exports.getSingleBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;

        // Find blog by ID and populate the 'user' field with 'name' and 'email'
        const blog = await Blog.findById(blogId).populate('user', 'name email');

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server error while fetching blog" });
    }
};
