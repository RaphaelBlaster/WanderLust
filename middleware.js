const Listing = require("./models/listing.js");
const listingSchema = require("./schema.js");
const ExpressError = require("./utils/expressError.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const cloudinary = require("./cloudConfig");
const streamifier = require("streamifier");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }

    next();
};

module.exports.redirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Validate listing data against Joi schema
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const ersMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, ersMsg);
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    const user = req.user || res.locals.curUser;
    const ownerId = listing.owner && listing.owner._id ? listing.owner._id : listing.owner;
    if (!user || !ownerId || ownerId.toString() !== user._id.toString()) {
        req.flash("error", "You are not authorized to edit this listing!");
        return res.redirect(`/listings/${id}`);
    }
    // expose listing for downstream handlers if needed
    res.locals.listing = listing;
    next();
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let ersMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, ersMsg);
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.curUser._id)) {
        req.flash("error", "You are not authorized to delete this review");
        res.redirect(`/listings/${id}`);
        return;
    }
    next();
}

module.exports.imgUpload = async (req, res, next) => {
    if (!req.file) return next();
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "wanderlust_DEV" },
            (err, uploadResult) => {
                if (err) reject(err);
                else resolve(uploadResult);
            }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    req.body.listing.image = { url: result.secure_url };
    next();

}
