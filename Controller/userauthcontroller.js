const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../model/usermodel'); // Assuming you have a User model
const dotenv = require('dotenv');

dotenv.config();


passport.use(new GoogleStrategy({
    clientID:  process.env.GOOGLE_CLIENT_ID, // Make sure this is set in your .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Ensure this is correct
    callbackURL: '', // Replace with your correct URL
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Here, find or create a user in the database using profile information
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
