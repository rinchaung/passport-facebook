require('dotenv').config();
const User = require('./models/user.model');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

// Configure Passport to use Facebook OAuth2 strategy
module.exports = (passport) => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL
      },
      async function(accessToken, refreshToken, profile, done) {
        console.log(profile);
    
        const user = await User.findOne({ facebookId: profile.id });
        if(user){
            return done(null, user);
        }
        else{
            // Create a new user
            const newUser = await User({
                facebookId: profile.id,
                name: profile.displayName,
                email: "nodeDev007@gmail.com",
                image: "my-image.png"
            })
            
            // Save the new user
            const savedUser = await newUser.save();
            return done(null, savedUser);
        }
      }
    ));
    
    // Serialize user profile into the session
    passport.serializeUser(async (user, done) => {
        done(null, user);
    });
    
    // Deserialize user profile into the session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            if(!user){
                throw new Error(`User is not found`);
            }
        } catch (error) {
            done(error, null);
        }
    });
};