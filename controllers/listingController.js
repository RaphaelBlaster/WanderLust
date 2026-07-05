// Listing model
const Listing = require("../models/listing.js");
// Custom error class
const ExpressError = require("../utils/expressError.js");
const { geocode } = require("../utils/geocode.js");


// Export controller actions
module.exports = {
  // List all listings (with optional search)
  index: async (req, res) => {
    const { q } = req.query;
    let allListings;
    if (q && q.trim() !== "") {
      const regex = new RegExp(q.trim(), "i"); // case-insensitive search
      allListings = await Listing.find({
        $or: [
          { title: regex },
          { description: regex },
          { location: regex },
          { country: regex },
        ],
      });
    } else {
      allListings = await Listing.find({});
    }
    res.render("listings/index.ejs", { allListings, searchQuery: q || "" });
  },
  // Render form for creating a new listing
  renderNewForm: (req, res) => {
    res.render("listings/new.ejs");
  },
  // Show details of a specific listing
  show: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
      req.flash("error", "Listing Not Found!");
      res.redirect("/listings");
      return;
    }
    res.render("listings/show.ejs", { listing });
  },
  // Render form for editing a listing
  renderEditForm: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Not Found!");
      res.redirect("/listings");
      return;
    }
    let originalImageUrl = listing.image.url;
    let previewImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, previewImageUrl });
  },
  // Update a listing with new data
  update: async (req, res) => {
    const { id } = req.params;
    // Geocode location and attach geometry before update
    const { lat, lng } = await geocode(req.body.listing.location);
    req.body.listing.geometry = { lat, lng };
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  },
  // Create a new listing
  create: async (req, res) => {
    // Image URL already attached to req.body.listing.image by the route
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    // Geocode location and attach geometry
    const { lat, lng } = await geocode(req.body.listing.location);
    newListing.geometry = { lat, lng };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  },
  // Delete a listing
  delete: async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  }
};