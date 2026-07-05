// Fix geometry for all listings using Nominatim geocoding
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { geocode } = require("./geocode");

mongoose.connect("mongodb://127.0.0.1:27017/urbanstay");

async function fix() {
  const listings = await Listing.find({});
  for (let listing of listings) {
    const { lat, lng } = await geocode(listing.location);
    listing.geometry = { lat, lng };
    await listing.save();
    console.log(`Fixed: ${listing.title} → ${lat}, ${lng}`);
  }
  await mongoose.disconnect();
}
fix();
