const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports.getCallback = (req, res, next) => {
  // console.log("Callback function has been called");

  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=Unauthorized`);
    }
    // console.log(user.user);
    const token = jwt.sign(
      { id: user.user._id, email: user.user.email, image: user.user.image, role: user.user.role ,username:user.user.username},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`${process.env.FRONTEND_URL}/signup?token=${token}`);
  })(req, res, next);
};
module.exports.getlogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});