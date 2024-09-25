// src/routes/auth.js  
const router = require('express').Router();  
const passport = require('passport');  
const jwt = require('jsonwebtoken');  
const User = require('../Model/usermodel');  

// Google Auth Route  
router.get('/google', passport.authenticate('google', {  
    scope: ['profile', 'email']  
}));  

// Google Auth Callback  
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), async (req, res) => {  

    console.log(req.body)
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });  
    res.cookie('token', token, {
           httpOnly: true,  
            path: "/", // cookie path
        //   Domain: ".onrender.com", // domain for the cookie
          secure: true, // accessible through HTTP
          httpOnly: true, // only server can access the cookie
          sameSite: "none", // enforcement type
          partitioned: false, });  
     
});  

// Extract user info  
router.get('/me', (req, res) => {  
    if (!req.user) return res.status(401).send({ message: 'Not authenticated' });  
    res.json(req.user);  
});  

module.exports = router;
