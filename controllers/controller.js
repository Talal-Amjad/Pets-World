const connection = require("../DB_Connection/connection");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const transporter=require("../nodemailer/transporter");
const multer=require('multer');
//for getting data from encrypted sent data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Signup
const signup=(req, res) => {

    const Name=req.body.Fname+req.body.Lname;
    const username = req.body.username;
    const Email = req.body.email;
    const password = req.body.password;

    const user = {Name:Name,UserName:username, Email:Email,Password:password};
    req.session.newUser = user;
    //res.send(user);
    const code = "1e4c734";

    req.session.code = code;

    let mail = transporter.sendMail({
        from: '"Talal Amjad" <petsworld0290@gmail>',
        to: `${Email}`,
        subject: "Verification Code For Registration",
        text: "Hello world?",
        html: `<h1>PetsWorld Verification Code!</h1>
               <p><b>Your Code is : ${code}</b></p>`
    });
    res.render("users/verifycode");
}
//code verification
const codeverification=(req, res) => {

    const Code = req.body.code;
    c

    if (Code.toString() == req.session.code.toString()) {
        res.redirect(307,"/RegisterUser");
    }
    else {
        req.session.code = null;
        res.send("Wrong Verification Code!\nTry To SignUp Again...");
    }


}
//Saving Data to database After code verification
const register=(req, res) => {

    const data = req.session.newUser;
    //res.send(data);
    const name=data.Name;
    const username = data.UserName;
    const Email = data.Email;
    const password = data.Password;

    const Query = `INSERT INTO USER VALUES('${name}','${username}','${Email}','${password}')`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/Signin");
    })

}

//function for signin
const signin =(req, res) => {

    const UserName = req.body.username;
    const Password = req.body.password;
    const Role = req.body.role;

    let TableName = "";
    Role == "admin" ? TableName = "ADMIN" : TableName = "USER";

    console.log(Role, " ", UserName, " ", Password, " ", TableName);

    const Query = `SELECT UserName, Password FROM ${TableName} WHERE UserName = '${UserName}' AND Password = '${Password}'`;
    connection.query(Query, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {

            if (Role == "admin") {
                const admin = { username: UserName, password: Password };
                req.session.admin = admin;
                res.cookie("CurrentRole", "Admin");
                res.redirect("/adminpanel");
            }
            else if (Role == "user") {
                const user = { username: UserName, password: Password };
                req.session.user = user;
                res.cookie("CurrentRole", "User");
                res.redirect("/products");
            }

        }
        else {
            res.send("Invalid Name or password");
        }
    })
}
//forget password
const changerequest=(req, res) => {

  
    const Email = req.body.email;
    

    const user = {Email:Email};
    req.session.newUser = user;

    const code = "200190";

    req.session.code = code;

    let mail = transporter.sendMail({
        from: '"Talal Amjad" <petsworld0290@gmail>',
        to: `${Email}`,
        subject: "Password updation Verification Code",
        text: "Hello world?",
        html: `<h1>PetsWorld Verification Code!</h1>
               <p><b>Your Code is : ${code}</b></p>`
    });
    res.render("users/changePassword");
};
//chaange password
const changepassword=(req,res)=>
{
    const username = req.body.username;
    const code1 = req.body.code;
    const password = req.body.password;
    const user = {UserName:username,Password:password};
    req.session.newUser = user;

    const code = "200190";

    req.session.code = code;
    const Query = `SELECT * from USER WHERE UserName = '${username}'`;
    connection.query(Query, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            if (code1!=code){
                res.send('Invalid Verification Code')
            }
        
            else{
                const Query1 = `UPDATE USER SET password = '${password}' WHERE username = '${username}'`;
                connection.query(Query1, function (err, result) {
                    if (err) throw err;
                    res.redirect("/Signin");
                })
            }
           
        }
        else{
            res.send('Wrong details')
        }
    })
}
//user products view
const products =(req, res) => 
{
    const Query = "SELECT * FROM Products";
    connection.query(Query, function (err, result) {
        if (err) throw err;
        // console.log(result);
        
        res.render("users/products",
            {
                data: result,
               
            }
            
        );
    }
)
}
//productDetails
const productDetails=(req, res) => {


    const pid = req.params.pid;
    const Query = `Select * from products  WHERE pid = '${pid}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        // console.log(result);
        
        res.render("users/productDetails",
            {
                data: result,
               
            }
            
        );
    }
)}
//add product for Admin
const add =(req, res) => {

    if (!req.file) {
        return req.statusCode(404).send("No File Recieved!");
    }

    const pid = req.body.pid;
    const Name = req.body.pname;
    const dis=req.body.dis;
    const catagory=req.body.catagory;
    const price=req.body.price;
    const img = req.file.originalname;
    const quantity=req.body.quantity;

    const Query = `INSERT INTO PRODUCTS  (pid,PName,Discription,Catagory,price,Picture,quantity) VALUES ('${pid}','${Name}','${dis}','${catagory}','${price}','${img}','${quantity}' )`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/stock");
    })
}
//admin stock view
const stock =(req, res) => 
{
    const Query = "SELECT * FROM Products";
        connection.query(Query, function (err, result) {
            if (err) throw err;
            // console.log(result);
            
            res.render("Admin/stock",
                {
                    data: result,
                   
                }
                
            );
        }
)}
module.exports=
{
    signup,
    codeverification,
    register,
    signin,
    changerequest ,
    changepassword,
    products,
    productDetails,
    add,
    stock
}