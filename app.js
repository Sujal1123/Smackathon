const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const localStorge = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");

const MONGO_URL = "mongodb://127.0.0.1:27017/smackathon";

main().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("views engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.render("../views/listings/home.ejs");
});

app.use(
    session({
        secret: "mysecretcode",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());

app.get("/trackingexpense", (req,res) => {
    res.render("../views/listings/tracking.ejs");
});

app.get("/managingdebt", (req,res) => {
    res.render("../views/listings/managing.ejs");
});

app.get("/financialgoal", (req,res) => {
    res.render("../views/listings/financialgoal.ejs");
});

app.get("/contact", (req,res) => {
    res.render("../views/listings/contact.ejs");
});

app.get("/login", (req,res) => {
    res.render("")
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});