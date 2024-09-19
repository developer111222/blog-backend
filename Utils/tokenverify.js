const jwt = require('jsonwebtoken')
const User=require("../Model/usermodel")
const key=process.env.JWT_SECRET;

const authorizationUser = async(req, res, next) => {
  const authHeader = req.headers["authorization"];
console.log(req.cookies.token)

  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : req.cookies.token; // Check if token is available in cookies

  if (!token) {
    return res.status(401).json({ message: "Login is required" });
  }

  try {
    // Verify the token
    console.log(token,"valid");
    const decoded = jwt.verify(token, key);
     // Fetch the user from the database and attach it to the request object
     const user = await User.findById(decoded.id);

     if (!user) {
       return res.status(401).json({ message: "User not found" });
     }
 
     req.user = user; // Attach the entire user object to the request

     console.log(req.user),"user by";
     next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// roleAuth.js

const authorizationRoles = (roles) => {
  return (req, res, next) => {
    // Ensure the user is authenticated and their role is valid
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied: Insufficient permissions" });
    }
    next(); // User has the required role, allow them to proceed
  };
};

module.exports = {authorizationUser,authorizationRoles};
