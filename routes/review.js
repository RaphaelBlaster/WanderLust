const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviewController.js");

// Review routes
router.route("/")
  .post(isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.route("/:reviewId")
  .delete(isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
