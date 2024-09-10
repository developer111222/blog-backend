const User=require('../Model/usermodel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const verifyToken=require("../Utils/tokenverify")

exports.usersignup = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password, "dfygsudj");

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please fulfill the input" }); // Fixed typo and status code
        }

        const matchData = await User.findOne({ email });
        if (matchData) {
            return res.status(402).json({ message: "User already exists" }); // Fixed status code
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        return res.status(200).json({ message: "User successfully signed up" });
    } catch (error) {
        return res.status(500).json({ message: "Server error while creating user" });
    }
};


//login

exports.userlogin = async (req, res, next) => {  
    const { email, password } = req.body;  
    console.log(email, password);  

    try {  
        // Check for email and password  
        if (!email || !password) {  
            return res.status(400).json({ message: "Please fulfill the input" });  
        }  

        // Find the user by email  
        const userdata = await User.findOne({ email });  
        if (!userdata) {  
            return res.status(400).json({ message: "User not found" });  
        }  

        // Compare the provided password with the hashed password in db  
        const isMatch = await bcrypt.compare(password, userdata.password);  
        if (!isMatch) {  
            return res.status(400).json({ message: "Invalid password" });  
        }  

        // Create token  
        const token = jwt.sign({ id: userdata.id,role:userdata.role }, process.env.JWT_SECRET, { expiresIn: '1h' });  

        // Set cookie and respond  
        return res.cookie('token', token, {  
            httpOnly: true,  
            // secure: process.env.NODE_ENV === 'production', // Uncomment for production
            sameSite: 'None',  
            maxAge: 3600000 // 1 hour  
        }).status(200).json({ message: "Login successful" }) 
        
        // return res.status(200).json({ message: "Login successful" }); // Send a response  
    } catch (error) {  
        return res.status(500).json({ message: `Internal server error: ${error.message}` });  
    }  
}; 

// get profile information

exports.getprofile = async (req, res) => {
    try {
      const user = await User.findById(req.user); // Use req.user, set by the authorization middleware
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error while fetching user profile" });
    }
  };


  //-------logout------

  exports.userlogout=(req,res,next)=>{
    res.clearCookie('token');
    res.status(200).json({message:"logout successful"})
  }
