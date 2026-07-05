const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/urbanstay";

main()
    .then(() => { console.log("Connected to mongoDB"); })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((listing) => ({ ...listing, owner: "68b44e44c02a9b1e036054d5" }));
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
};

initDB();
