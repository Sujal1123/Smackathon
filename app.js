const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStorage = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStrore = require("connect-mongo");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

let uri = "mongodb+srv://sujaldandhale:PgBoh6l72RNS5x9q@cluster1.tkzjs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

main().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(uri);
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


const store = MongoStore.create({
    mongoUrl: uri,
    crypto: {
      secret: "mysecretcode",
    },
    touchAfter: 24*3600
  });

  store.on("error", () => {
    console.log("error in mongo session store", err);
  });

app.use(
    session({
        store: MongoStore.create({ mongoUrl: dbUrl }),
        secret: "mysecretcode",
        resave: false,
        saveUninitialized: true,
    })
);


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStorage(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/trackingexpense", (req,res) => {
    res.render("../views/listings/trackingex.ejs");
});

app.get("/managingdebt", (req,res) => {
    
    res.render("../views/listings/managingdebt.ejs");
});

app.get("/financialgoal", (req,res) => {
    res.render("../views/listings/financialgoal.ejs");
});

app.get("/contact", (req,res) => {
    res.render("../views/listings/contact.ejs");
});

app.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

app.post("/signup", async(req,res) => {
  let {username, email, password} = req.body;
  const newUser = new User({email, username});
  const registeredUser = await User.register(newUser, password);
  console.log(registeredUser);
  res.redirect("/");
});

app.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

app.post("/login", passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), async(req,res) => {
  res.redirect("/");
});

app.all("*", (req, res, next) => {
    new ExpressError(404, "Page Not Found");
    next();
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
