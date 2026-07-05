const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { isLoggedIn, isOwner, validateListing, imgUpload } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new ExpressError(400, 'Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});
const cloudinary = require("../cloudConfig");
const streamifier = require("streamifier");


const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ExpressError(404, "Page Not Found"));
  }
  next();
};

// Listing routes
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(imgUpload),
    validateListing,
    wrapAsync(listingController.create)
  );


// New listing form
router.route("/new")
  .get(isLoggedIn, listingController.renderNewForm);

// Specific listing routes
router.route("/:id")
  .get(validateObjectId, wrapAsync(listingController.show))
  .put(validateObjectId, isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(imgUpload), validateListing, wrapAsync(listingController.update))
  .delete(validateObjectId, isLoggedIn, isOwner, wrapAsync(listingController.delete));

// Edit listing form
router.route("/:id/edit")
  .get(validateObjectId, isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
