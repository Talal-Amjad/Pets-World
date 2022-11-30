const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_project"
});

connection.connect(function(err){
    if(err)
    {
        console.log("Database Connection Failed!");
        throw err;
    }
    else
    {
        console.log("Database Connected!");
    }
})

module.exports = connection;