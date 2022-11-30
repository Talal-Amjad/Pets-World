const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const functions=require("../controllers/controller");
const transporter=require("../nodemailer/transporter");
const Auth = require("../middleware/auth");

//for getting data from encrypted sent data
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



//user routing pages
router.get("/", (req, res) => { res.render("users/index"); });
//Routing for signup
router.get("/Signup", (req, res) => { res.render("users/Signup"); });
//TAking data from user
router.post("/Signup",functions.signup);
//code verification
router.post("/verifycode",functions.codeverification );
//Storing data to database
router.post("/RegisterUser",functions.register);
//routing for signin
router.get("/Signin", (req, res) => { res.render("users/Signin"); });
//fetcing data from 
router.post("/Signin",functions.signin);
//routing for password change request.
router.get("/changerequest", (req, res) => { res.render("users/pswChangeRequest"); });
router.post("/changerequest", functions.changerequest);
//routing for changing password
router.get("/changePassword", (req, res) => { res.render("users/changePassword"); });
router.post("/changePassword",functions.changepassword);
router.get("/Feedback", (req, res) => { res.render("users/Feedback"); });
router.get("/products", (req, res) => { res.render("users/products"); });
router.get("/productdetails", (req, res) => { res.render("users/productdetails"); });
router.get("/Billing", (req, res) => { res.render("users/Billing"); });
router.get("/Billing", (req, res) => { res.render("users/Billing"); });
//admin routing


module.exports = router;