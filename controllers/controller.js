const connection = require("../DB_Connection/connection");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const transporter=require("../nodemailer/transporter");

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
    const Code=req.body.code;
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
module.exports=
{
    signup,
    codeverification,
    register
}