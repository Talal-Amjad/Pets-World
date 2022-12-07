const express = require("express");
const router = express.Router();
const multer = require("multer");
const bodyParser = require("body-parser");
const functions = require("../controllers/controller");
const transporter = require("../nodemailer/transporter");
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

//routing user logout
router.get("/userlogout",functions.userlogout);
//user routing pages
router.get("/", (req, res) => { res.render("users/index"); });
//Routing for signup
router.get("/Signup", (req, res) => { res.render("users/Signup"); });
//TAking data from user
router.post("/Signup", functions.signup);
//code verification
router.post("/verifycode", functions.codeverification);
//Storing data to database
router.post("/RegisterUser", functions.register);
//routing for signin
router.get("/Signin", (req, res) => { res.render("users/Signin"); });
//fetcing data from 
router.post("/Signin", functions.signin);
//routing for reset Password
router.get("/resetpsw", (req, res) => { res.render("users/resetPassword"); });
//fetcing data from 
router.post("/resetpsw", Auth.userAuth,functions.resetpsw);
//routing for password change request.
router.get("/changerequest", (req, res) => { res.render("users/pswChangeRequest"); });
router.post("/changerequest", functions.changerequest);
//routing for changing password
router.get("/changePassword", (req, res) => { res.render("users/changePassword"); });
router.post("/changePassword", functions.changepassword);
router.get("/Feedback", (req, res) => { res.render("users/Feedback"); });
//routing for Products
router.get("/products", Auth.userAuth,functions.products);
//product details
router.get("/productDetails/:pid", Auth.userAuth,functions.productDetails);
//comments
router.post("/comments/:id", Auth.userAuth,functions.comment);
router.get("/Billing", (req, res) => { res.render("users/Billing"); });
//Add to card items
router.post("/selectedproducts/:pid/:price", Auth.userAuth,functions.selected);
//list of products that are added to cart
router.get("/selectedlist", Auth.userAuth,functions.add_to_cart_list);
//delltig products from add_to_cart_list
router.get("/selectedlist/:pid", Auth.userAuth,functions.delete_from_add_to_cart_list);
//Delivery Address
router.get("/deliveryAddress", (req, res) => { res.render("users/deliveryAddress"); });
//bill
router.post("/invoice", Auth.userAuth,functions.invoice);
//After confirming oder for send mail
router.get("/confirmoder",Auth.userAuth,functions.confirmoder);
//feedback routing
//routing for signin
router.get("/feedback", (req, res) => { res.render("users/feedback"); });
//fetcing data from 
router.post("/feedback",Auth.userAuth, functions.feedback);
//ratings
router.post("/addRating", Auth.userAuth,functions.getRating);
router.get("/ratings", Auth.userAuth,functions.Rating);
//add_to_wish_List
router.get("/add_to_wishlist/:pid", Auth.userAuth,functions.add_to_wishlist);
//view wishlist
router.get("/view_wishlist",Auth.userAuth,functions.view_wishlist)
//delete from wishlist
router.get("/view_wishlist/:pid", Auth.userAuth,functions.delete_from_wishlist);
/*==================================================================================
                                Admin Routing
 ===================================================================================*/
//admin routing
//routing Admin logout
router.get("/adminlogout",functions.Adminlogout);
//routing addproducts
router.get("/addproduct", (req, res) => { res.render("Admin/addproduct"); });
router.post("/addproduct", Auth.Auth, upload.single("img"), functions.add);
router.get("/adminpanel", Auth.Auth, functions.dashboard);

router.get("/Payments", Auth.Auth, (req, res) => { res.render("Admin/Payments"); });
//stock routing
router.get("/stock", Auth.Auth,functions.stock);
//deletion
router.get("/stock/:pid", Auth.Auth, functions.deletetion);
//updations
router.get("/update/:pid", Auth.Auth, functions.selection_update);
router.post("/update/:pid", Auth.Auth, upload.single("img"), functions.update);
//all users list
router.get("/userDetails", Auth.Auth,functions.users);
//user deletion
//deletion
router.get("/userDetails/:UserName", Auth.Auth, functions.deleteuser);
//all oders confirmed from the users
router.get("/oders", Auth.Auth, functions.oders);
//To remove product from the list of oders placed by the users
router.get("/oders/:pid/:username",Auth.Auth,functions.canceloder);
router.get("/oder/:pid/:username",Auth.Auth,functions.deliveredoder);
//payment 
router.get("/payment", Auth.Auth,functions.payment);
//view all users feedback
router.get("/viewfeedback",Auth.Auth, functions.viewfeedback);
//sending reports
router.get("/paymentpdf",Auth.Auth,functions.paymentpdf); 
module.exports = router;