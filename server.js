var express = require("express");
var app = express();

const server = app.listen(8080, function(){
    console.log('Server with socket.io working on port 8080')
});
var io = require("socket.io")(server);

app.use(express.static(__dirname +"/static"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

var messagesAll = [];

app.get("/", function(request, response){
    response.render("home");
});

io.on("connection", function(socket){
    console.log("Testing connection");
    console.log(messagesAll);
    socket.emit('loadingMessages', messagesAll);

    socket.on("chatUsers", function (messageData) {
        messagesAll.push(messageData);
        io.sockets.emit('listenAll', messageData);
    });

    //--------------------------------------
    console.log("Someone is connected!");
    io.sockets.emit('userJoin', socket.id);
    
    socket.on("notify", function () {
        io.sockets.emit('notification', socket.id);
    });

    socket.on("disconnect", function(){
		io.emit("left", socket.id);
	})
    //--------------------------------------
    
});

io.off("connection", function (socket) {
    io.sockets.emit('left', socket.id);
});



