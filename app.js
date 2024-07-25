const express = require('express')
const app = express();
const http=require('http');
const path =require('path');
const PORT= process.env.PORT || 3000
const socketio = require('socket.io')

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")))

const server = http.createServer(app);
const io=socketio(server)

io.on("connection",(socket)=>{
    socket.on('send-location',(data)=>{
        io.emit("receive-location",{id:socket.id, ...data})
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected")
    })
    console.log("User connected")
})
app.get('/', function(req, res){
    res.render('index');
})

server.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})