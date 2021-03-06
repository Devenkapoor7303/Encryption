require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const md5 = require('md5');
const ejs = require("ejs");
const mongoose=require("mongoose");
const findOrCreate = require('mongoose-findorcreate');

const session = require('express-session');
const passport= require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const app = express();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'DkDon',
    resave: false,
    saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/hacking",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex",true);
const userSchema=new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const Secret=mongoose.model("Secret",userSchema);
passport.use(Secret.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.goggleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    Secret.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
app.get("/auth/google", passport.authenticate("google",{scope:["profile"]}));
app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secrets');
  });
app.get("/",function(req,res){
    res.render("home");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
    
})
app.post("/login",function(req,res){
})
app.listen(3000, function () {
    console.log("Server is running at port 3000");
})