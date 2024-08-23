const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

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

app.get("")

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});