
require("dotenv").config();

const express = require("express");
const app = express()
const path = require("path");
const mongoose = require("mongoose");
const PORT = 8080;
// const MONGO_URL = "mongodb://127.0.0.1:27017/urbanstay";
const dbUrl = process.env.ATLASDB_URL;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
const userRouter = require("./routes/user.js");
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

main()
    .then(() => { console.log("Connected to mongoDB"); })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
// app.use(express.json());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: { secret: process.env.SECRET }
});

store.on("error", (err) => {
    console.log("ERROR in Mongo Session Store", err);
});


const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};




app.get("/", (req, res) => {
    res.send("<h1>Hi , I am Root</h1>");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
})

app.get('/demouser', async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student",
    });

    let registeredUser = await User.register(fakeUser, "delta-student");
    res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somethings went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`)
});
