const User = require("../models/users.js");
const passport = require("passport");


module.exports = {
  renderSignupForm: (req, res) => {
    res.render("./users/new.ejs");
  },
  signup: async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  },
  renderLoginForm: (req, res) => {
    res.render("./users/login.ejs");
  },
  login: async (req, res) => {
    req.flash("success", "Welcome Back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
   },
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    });
  }
};