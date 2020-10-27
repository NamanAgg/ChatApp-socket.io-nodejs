
const express = require("express");
const bodyParser = require("body-parser");
//const request= require("request");
const ejs = require("ejs");
const http=require("http");
const _=require("lodash");
const mongoose=require("mongoose");
const path=require("path");
const app = express();
const socketIO=require("socket.io");

const port=process.env.PORT|| 3000;


app.set('view engine', 'ejs');
//mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let server=http.createServer(app);
let io= socketIO(server);
app.get("/",function(req,res){
  //res.sendFile(path.resolve('../public/blah.html'));
  res.render("index");
});

io.on('connection',function(socket){
  console.log("A new user just got connected");

  socket.emit("newMessage",{
    from:"Admin",
    text:"Welcome to Chat App",
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage',{
    from:"Admin",
    text:"A new user has just connected",
    createdAt:new Date().getTime()
  });

  socket.on("createMessage",function(message){
    console.log("create Message ",message);//here we can also have done console.log("create Message"+ message); but the one we have done is better
    io.emit("newMessage",{
      from:message.from,
      text:message.text,
      createdAt: new Date().getTime()
    });
  });
  socket.on("disconnect",function(){
    console.log("User was disconnected");
  });
});




server.listen(port,()=>{
  console.log('server started on port '+ port);

});
