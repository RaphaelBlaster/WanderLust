const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require("../controllers/userController.js");

// Signup routes
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// Login routes
router.route("/login")
  .get(userController.renderLoginForm)
  .post(redirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.login));

// Logout route
router.route("/logout")
  .get(userController.logout);

module.exports = router;
