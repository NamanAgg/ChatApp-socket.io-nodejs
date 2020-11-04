
const express = require("express");
//const bodyParser = require("body-parser");
//const request= require("request");
//const ejs = require("ejs");
//const _=require("lodash");
//const mongoose=require("mongoose");
const http=require("http");
const path=require("path");
const app = express();
const socketIO=require("socket.io");

const  mes=require(__dirname+"/utils/message.js");
const isRealString=require(__dirname+"/utils/isRealString.js"); //to check whether the user has filled a valid form for name and room name and didnt just entered only by spacebar.
const Users=require(__dirname+"/utils/users.js"); //this is ES6 class where have made methods to do real work like delting user from room,adding users in room, showing their name corresponds with their message.
const port=process.env.PORT|| 3000;

//mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true});
//app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

let server=http.createServer(app);
let io= socketIO(server);
let users = new Users();

app.get("/",function(req,res){
  res.sendFile(path.resolve('../public/index.html'));
  //res.render("index");
});


io.on("connection",function(socket){
  console.log("A new user just got connected");

  socket.on("join", (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback("Name and room are required");
    }

    socket.join(params.room); //this is done to join the room and then after that we
                              //can use .to functionality which is used under this code.
                              //this .to will determine to emit the message in that specific room.
                              // if we dont specify it will be emitted to all rooms.
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUsersList", users.getUserList(params.room));
    socket.emit("newMessage", mes.generateMessage("Admin", `This is room ${params.room}!`));

    socket.broadcast.to(params.room).emit("newMessage", mes.generateMessage("Admin", "New User Joined!"));

    callback();
  });

  socket.on("createMessage",function(message,callback){
    console.log("create Message ",message);//here we can also have done console.log("create Message"+ message); but the one we have done is better
    let user=users.getUser(socket.id);
    if(user && isRealString(message.text)){
    io.to(user.room).emit("newMessage",mes.generateMessage(user.name,message.text));
    }
    callback("this is your server speaking.");
  });

  socket.on("createLocationMessage", (coords) => {
    let user = users.getUser(socket.id);  //these are to store the return of these functions.

    if(user){
      io.to(user.room).emit("newLocationMessage", mes.generateLocationMessage(user.name, coords.lat, coords.lng));
    }
  })
  socket.on("disconnect",function(){
    let user = users.removeUser(socket.id); //these are to store the return of these functions.

    if(user){
      io.to(user.room).emit("updateUsersList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", mes.generateMessage("Admin", `${user.name} has left ${user.room} chat room.`));
    }
    console.log("User was disconnected");
  });



});




server.listen(port,()=>{
  console.log("server started on port "+ port);

});
