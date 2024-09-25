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
    const token = jwt.sign({ id: req.user.id }, 'kdhsfjfbndbfvnsdbfvsdnfbndb', { expiresIn: '1h' });  
    res.cookie('token', token, { httpOnly: true });  
    res.redirect('https://new-sooty-xi.vercel.app/'); // Redirect to your frontend or wherever you want  
});  

// Extract user info  
router.get('/me', (req, res) => {  
    if (!req.user) return res.status(401).send({ message: 'Not authenticated' });  
    res.json(req.user);  
});  

module.exports = router;
