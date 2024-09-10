const Blog=require("../Model/blogmodel")

exports.createBlog=async(req,res,next)=>{
    const {title,description}=req.body;
    console.log(req.body)
    console.log(req.user._id,"gdh")
    const user=req.user._id;
  
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
        // throw new Error("Unauthorized")  // If you want to throw an error in Node.js
    }
    try {
       

        const newBlog=new Blog({title,description,user})
        await newBlog.save()
        res.status(201).json({message:"Blog created successfully"})
    } catch (error) {
        res.status(500).json({message:"Server error while creating blog"})
    }

}


//------get blog-----------

exports.getBlogs = async (req, res, next) => {
    try {
      // Fetch blogs and populate the 'user' field with 'name' and 'email' from the User model
      const blogs = await Blog.find().populate('user', 'name email'); // Replace 'name email' with the fields you want to retrieve
  
      res.status(200).json({
        success: true,
        blogs
      });
    } catch (error) {
      res.status(500).json({ message: "Server error while fetching blogs" });
    }
  };

  //----------get single blog--------

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
      res.status(500).json({ message: "Server error while fetching blog" });
    }
  };