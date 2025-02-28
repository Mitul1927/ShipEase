const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv  = require("dotenv");
dotenv.config();
// console.log(process.env.BACKEND_URL)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
      callbackURL:`${process.env.BACKEND_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        // console.log(user.image);

        const token = jwt.sign(
          { id: user._id, email: user.email, image: user.image,username:user.username,role:user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((userData, done) => {
  done(null, userData);
});

passport.deserializeUser((userData, done) => {
  done(null, userData);
});

module.exports = passport;
