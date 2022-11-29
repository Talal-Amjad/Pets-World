const express =require('express');

const app=express();
const path =require('path');
const routes=require('./routes/petsworld');

 app.set('view engine','ejs');
  
 const publicPath = path.join(__dirname, "/public");
 app.use(express.static(publicPath));

 app.use("/", routes);

 app.listen(3000, (err)=>{
    if(err) throw err;
    console.log(`Server Listening At Port 3000`);
})