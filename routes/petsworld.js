const express = require("express");
const router = express.Router();
const multer = require("multer");
const bodyParser = require("body-parser");
const functions=require("../controllers/controller");
const transporter=require("../nodemailer/transporter");
const Auth = require("../middleware/auth");

//for getting data from encrypted sent data
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
//images storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, "./public/images") },
    filename: function (req, file, cb) { cb(null, file.originalname) }
})
const upload = multer({ storage: storage });




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
//routing addproducts
router.get("/addproduct", (req, res) => { res.render("Admin/addproduct"); });
router.post("/addproduct",Auth.Auth,upload.single("img"),functions.add);
router.get("/adminpanel", Auth.Auth,(req, res) => { res.render("Admin/adminpanel"); });
router.get("/oders",Auth.Auth, (req, res) => { res.render("Admin/oders"); });
router.get("/Payments",Auth.Auth, (req, res) => { res.render("Admin/Payments"); });
router.get("/stock",Auth.Auth, (req, res) => { res.render("Admin/stock"); });
router.get("/userDetails", Auth.Auth,(req, res) => { res.render("Admin/userDetails"); });


module.exports = router;