const express = require("express");
const bodyParser = require("body-parser");
//const request= require("request");
const ejs = require("ejs");
const https=require("https");
const _=require("lodash");
const mongoose=require("mongoose");
const path=require("path");
const app = express();
const socketIO=require("socket.io");

const port=process.env.PORT|| 3000
app.set('view engine', 'ejs');
//mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let server=https.createServer(app);

app.get("/",function(req,res){
  //res.sendFile(path.resolve('../public/blah.html'));
  //res.render("index");


});


app.listen(port, function() {
  console.log('server started on port '+ port);

});
