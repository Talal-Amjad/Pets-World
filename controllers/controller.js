const connection = require("../DB_Connection/connection");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const transporter = require("../nodemailer/transporter");
const multer = require('multer');
const { time } = require("console");
const pdf = require("html-pdf");
const fs = require("fs");
const options = { format: "A4" };
//for getting data from encrypted sent data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//User Logout
const userlogout=(req,res)=>{
    req.session.user = null;
    res.redirect("/");
}
//Signup
const signup = (req, res) => {

    const Name = req.body.Fname + req.body.Lname;
    const username = req.body.username;
    const Email = req.body.email;
    const password = req.body.password;
    const Query = `Select * from user where username ='${username}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.send("UserName is already registered please try another username")
        }
        else {
            const user = { Name: Name, UserName: username, Email: Email, Password: password };
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
    })


}
//code verification
const codeverification = (req, res) => {

    const Code = req.body.code;

    if (Code.toString() == req.session.code.toString()) {
        res.redirect(307, "/RegisterUser");
    }
    else {
        req.session.code = null;
        res.send("Wrong Verification Code!\nTry To SignUp Again...");
    }


}
//Saving Data to database After code verification
const register = (req, res) => {

    const data = req.session.newUser;
    //res.send(data);
    const name = data.Name;
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
const signin = (req, res) => {

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
                res.redirect("/stock");
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
const changerequest = (req, res) => {
    const Email = req.body.email;
    const user = { Email: Email };
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
const changepassword = (req, res) => {
    const username = req.body.username;
    const code1 = req.body.code;
    const password = req.body.password;
    const user = { UserName: username, Password: password };
    req.session.newUser = user;

    const code = "200190";

    req.session.code = code;
    const Query = `SELECT * from USER WHERE UserName = '${username}'`;
    connection.query(Query, function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) {
            if (code1 != code) {
                res.send('Invalid Verification Code')
            }

            else {
                const Query1 = `UPDATE USER SET password = '${password}' WHERE username = '${username}'`;
                connection.query(Query1, function (err, result) {
                    if (err) throw err;
                    res.redirect("/Signin");
                })
            }

        }
        else {
            res.send('Wrong details')
        }
    })
}
//user products view
const products = (req, res) => {
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
const productDetails = (req, res) => {
    const pid = req.params.pid;
    const Query = `Select * from products  WHERE pid = '${pid}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        // console.log(result);
        //quer for displaying comments
        const Query2 = `Select * from comments  WHERE pid = '${pid}'`;
        connection.query(Query2, function (err, result2) {
            if (err) throw err;

            res.render("users/productDetails",
                {
                    data: result,
                    data2: result2
                }

            );
        })
    })
}
//comments
const comment = (req, res) => {
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var date = year + "-" + month + "-" + day;
    var hours = date_ob.getHours();
    var minutes = date_ob.getMinutes();
    var seconds = date_ob.getSeconds();
    var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    console.log(dateTime);
    const comment = req.body.comments;
    const id = req.params.id;
    const username = req.session.user.username;
    const Query = `INSERT INTO comments VALUES('${id}','${username}','${comment}','${dateTime.toString()}')`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect(`/productDetails/${id}`);
    })
}
//Selected item add to card
const selected = (req, res) => {
    const pid = req.params.pid;
    const price = req.params.price;
    const quantity = req.body.quantity;
    const total = price * quantity;
    console.log(total);
    const username = req.session.user.username;
    const status = 'NC';
    const Query = `INSERT INTO Shoppingdetails VALUES('${username}','${pid}','${quantity}','${price}','${total}','${status}')`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect(`/products`);
    })

}
//all itmes that are added to cart
const add_to_cart_list = (req, res) => {
    const username = req.session.user.username;
    const NC = 'NC';
    const Query = `SELECT * from Shoppingdetails where username = '${username}' and status = '${NC}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            const price = result[0].quantity * result[0].price;
            // console.log(price);
            res.render("users/selected_list",
                {
                    data: result,
                    totalprice: price
                }

            );
        }
        else {
            res.send("Currently You Have not selected any Product")
        }
    }
    )

}
//delete product from add to card list
const delete_from_add_to_cart_list=(req,res)=>{
    const id=req.params.pid;
    const username = req.session.user.username;
    const NC='NC';
    // res.send(Name);
    const Query = `DELETE  from shoppingdetails WHERE UserName = '${username}' and pid='${id}'  and status='${NC}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/selectedlist");
    })
}
//invoice
const invoice = (req, res) => {
    const phone = req.body.cellno;
    const address = req.body.address;
    const pcode = req.body.pcode;
    /*=============================================*/
    const username = req.session.user.username;
    // console.log(username,phone,address,pcode);
    const NC = 'NC';
    const Query = `SELECT * from Shoppingdetails where username = '${username}' and status = '${NC}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        //query to find total bill 
        const Query2 = `SELECT sum(total) as pay_able_bill from Shoppingdetails where username = '${username}' and status = '${NC}'`;
        connection.query(Query2, function (err, result2) {
            // console.log(result2);
            if (err) throw err;
            res.render("users/invoice",
                {
                    data: result,
                    phone: phone,
                    address: address,
                    pcode: pcode,
                    username: username,
                    data2: result2[0].pay_able_bill

                }

            )
        });
    }
    )

}
//after confirming oders
const confirmoder = (req, res) => {
    const phone = req.query.phone;
    const address = req.query.address;
    const username = req.session.user.username;
    const NC = 'NC';
    const Query = `SELECT * from Shoppingdetails where username = '${username}' and status = '${NC}'`;

    connection.query(Query, function (err, result) {
        if (err) throw err;
        //query to find total bill 
        const Query2 = `SELECT sum(total) as pay_able_bill from Shoppingdetails where username = '${username}' and status = '${NC}'`;
        connection.query(Query2, function (err, result2) {
            // console.log(result2);
            if (err) throw err;
            res.render("users/invoicepdf",
                {
                    data: result,
                    phone: phone,
                    address: address,
                    username: username,
                    data2: result2[0].pay_able_bill
                },
                function (err, html) {
                    pdf.create(html, options).toFile("PDF/Invoice.pdf", function (err, result) {
                        if (err) return console.log(err);
                        else {
                            var allusersPdf = fs.readFileSync("PDF/Invoice.pdf");
                            res.header("content-type", "application/pdf");
                            res.send(allusersPdf);
                            transporter.sendMail
                                ({
                                    from: '"Talal Amjad" <petsworld0290@gmail.com>',
                                    to: "mtakamboh@gmail.com",
                                    subject: "Users Report",
                                    text: "Hello world?",
                                    html: `<h1>Users Report</h1>
                                       <p>This is Users Report!</p>`,
                                    attachments: [
                                        {
                                            filename: 'Invoice.pdf',
                                            path: path.join(__dirname, "../PDF/Invoice.pdf")
                                        }]
                                });
                            const c = 'C';
                            const Query1 = `UPDATE shoppingDetails SET status = '${c}' WHERE username = '${username}'`;
                            connection.query(Query1, function (err, result) {
                                if (err) throw err;
                            })
                        }
                    })

                }

            )
        });
    }
    )
}
//feedback
const feedback=(req,res)=>{
    const username = req.session.user.username;
    const type=req.body.type;
    const feedback=req.body.feedback;
    const Query = `INSERT INTO feedback VALUES('${username}','${type}','${feedback}')`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/products");
    })
}
//add_to_wishList
const add_to_wishlist=(req,res)=>{
    const pid = req.params.pid;
    const username = req.session.user.username;
    const Query = `INSERT INTO wishlist VALUES('${username}','${pid}')`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect(`/products`);
    })
}
//view to wish list
const view_wishlist=(req,res)=>
{
    const username = req.session.user.username;
    const Query = `SELECT * from wishlist where username = '${username}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            const price = result[0].quantity * result[0].price;
            // console.log(price);
            res.render("users/wishlist",
                {
                    data: result,
                    totalprice: price
                }

            );
        }
        else {
            res.send("Currently You Have not selected any Product")
        }
    }
    )
}
//deleteing from wishlist
const delete_from_wishlist=(req,res)=>{
    const id=req.params.pid;
    const username = req.session.user.username;
    
    // res.send(Name);
    const Query = `DELETE  from wishlist WHERE UserName = '${username}' and pid='${id}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/view_wishlist");
    })
}
/*--------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------*/
const Adminlogout=(req,res)=>{
    req.session.admin = null;
    res.redirect("/");
}
//add product for Admin
const add = (req, res) => {

    if (!req.file) {
        return req.statusCode(404).send("No File Recieved!");
    }

    const pid = req.body.pid;
    const Name = req.body.pname;
    const dis = req.body.dis;
    const catagory = req.body.catagory;
    const price = req.body.price;
    const img = req.file.originalname;
    const quantity = req.body.quantity;
    const Query2 = `Select * from PRODUCTS where pid='${pid}' `;
    connection.query(Query2, function (err, result2) {
        if (err) throw err;
        if (result2.length > 0) {
            res.send("Product with same ID already exist. please recheck the ID.")
        }
        else {
            const Query = `INSERT INTO PRODUCTS  (pid,PName,Discription,Catagory,price,Picture,quantity) VALUES ('${pid}','${Name}','${dis}','${catagory}','${price}','${img}','${quantity}' )`;
            connection.query(Query, function (err, result) {
                if (err) throw err;
                res.redirect("/stock");
            })
        }

    })

}
//admin stock view
const stock = (req, res) => {
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
    )
}
//product deletion
const deletetion = (req, res) => {
    const id = req.params.pid;
    const Query = `DELETE FROM PRODUCTS WHERE pid = '${id}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/stock");
    })
}
//update
const selection_update = (req, res) => {
    const id = req.params.pid;
    const Query = `SELECT * from products WHERE pid = '${id}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.render("Admin/update", { data: result });
    })
}
const update = (req, res) => {

    if (!req.file) {
        return req.statusCode(404).send("No File Recieved!");
    }

    const pid = req.params.pid;
    const Name = req.body.pname;
    const dis = req.body.dis;
    const catagory = req.body.catagory;
    const price = req.body.price;
    const img = req.file.originalname;
    const quantity = req.body.quantity;

    const Query = `UPDATE Products SET PName = '${Name}', Discription = '${dis}',  Catagory = '${catagory}', price = '${price}',quantity='${quantity}' WHERE pid = '${pid}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/stock");
    })
}
//admin stock view
const users = (req, res) => {
    const Query = "SELECT * from USER";
    connection.query(Query, function (err, result) {
        if (err) throw err;
        // console.log(result);

        res.render("Admin/userDetails",
            {
                data: result,

            }

        );
    }
    )
}
const deleteuser = (req, res) => {
    const Name = req.params.UserName;
    // res.send(Name);
    const Query = `DELETE  from user WHERE UserName = '${Name}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/userDetails");
    })
}
//List of all Confirmed placed oders by the users
const oders=(req,res)=>{
    
    const Query = `SELECT * from Shoppingdetails where status ='C'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
      
            res.render("Admin/oders",
                {
                    data: result,
                 

                }

            )
        });
    }    
//Cancelled oders by the Admin
const canceloder=(req,res)=>
{
    const id=req.params.pid;
    const Name= req.params.username;
    
    // res.send(Name);
    const Query = `DELETE  from shoppingdetails WHERE UserName = '${Name}' and pid='${id}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        res.redirect("/oders");
    })
}
//sending data to payment from oders when oder is delivered
const deliveredoder=(req,res)=>{
    const id=req.params.pid;
    const Name= req.params.username;
    
    // res.send(Name);
    const Query = `select *  from shoppingdetails WHERE UserName = '${Name}' and pid='${id}'`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
       const username=result[0].username;
       console.log(result);
       const pid=result[0].pid;
       const quantity=result[0].qyantity;
       const price=result[0].price;
       const total=result[0].total;
       const Query2 = `insert into payment values('${username}','${pid}','${quantity}','${price}','${total}')`;
       connection.query(Query2, function (err, result2) {
           if (err) throw err;
           const Query3 = `DELETE  from shoppingdetails WHERE UserName = '${Name}' and pid='${id}'`;
    connection.query(Query3, function (err, result3) {
        if (err) throw err;
        res.redirect('/oders');
    })

    })
    })
} 

const Rating = (req, res) => {

    const pid = req.query.id;
    const Query = `Select count(Ratingno) as RatingNo from rating where pid='${pid}' and ratingno=1`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
        const Query1 = `Select count(Ratingno) as RatingNo from rating where pid='${pid}' and ratingno=2`;
        connection.query(Query1, function (err, result1) {
            if (err) throw err;
            const Query2 = `Select count(Ratingno) as RatingNo from rating where pid='${pid}' and ratingno=3`;
            connection.query(Query2, function (err, result2) {
                if (err) throw err;
                const Query3 = `Select count(Ratingno) as RatingNo from rating where pid='${pid}' and ratingno=4`;
                connection.query(Query3, function (err, result3) {
                    if (err) throw err;
                    const Query4 = `Select count(Ratingno) as RatingNo from rating  where pid='${pid}' and ratingno=5`;
                    connection.query(Query4, function (err, result4) {
                        if (err) throw err;
                        console.log(result);
                        res.render("users/ratings",{result:result,result1:result1,result2:result2,result3:result3,result4:result4, pid:pid});
                    })
                  
                })
            })
          
        })
    })
    

   
}

const getRating = (req, res) => {
     //route behind button -> /addRating/?id=productID
    
     const pid = req.query.id;
     const username = req.session.user.username;;
     const newUserName = `${username}${pid}`;
     const rating = req.body.rating;
     const Query = `INSERT INTO rating VALUES ('${username}','${pid}','${rating}')`;
     connection.query(Query, function (err, result) {
         if (err) throw err;
         res.redirect(`/ratings/?id=${pid}`);
     })

}

const payment=(req,res)=>{
    
    const Query = `SELECT * from payment`;
    connection.query(Query, function (err, result) {
        if (err) throw err;
      
            res.render("Admin/Payments",
                {
                    data: result,
                 

                }

            )
        });
    }   

module.exports =
{
    userlogout,
    signup,
    codeverification,
    register,
    signin,
    Rating,
    getRating,
    changerequest,
    changepassword,
    products,
    productDetails,
    comment,
    selected,
    add_to_cart_list,
    delete_from_add_to_cart_list,
    invoice,
    confirmoder,
    feedback,
    add_to_wishlist,
    view_wishlist,
    delete_from_wishlist,
    /*--------------------------------------------------------*/
    Adminlogout,
    add,
    stock,
    deletetion,
    selection_update,
    update,
    users,
    deleteuser,
    oders,
    canceloder,
    deliveredoder,
    payment
}