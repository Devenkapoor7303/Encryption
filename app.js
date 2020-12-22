require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const encrypt =require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/hacking",{useNewUrlParser: true, useUnifiedTopology: true});
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const userSchema=new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password'] });
const Secret=mongoose.model("Secret",userSchema);
app.set("view engine", "ejs");
app.use(express.static("public"));
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
    const newUser=new Secret({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if (err) {
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
})
app.post("/login",function(req,res){
    Secret.findOne({email:req.body.username},function(err,results){
        if (err) {
            console.log(err);
        }else{
            if (results.password===req.body.password) {
                res.render("secrets");
            }
        }
    })
})
app.listen(3000, function () {
    console.log("Server is running at port 3000");
})