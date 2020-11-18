const express = require('express');
const socket = require('socket.io')
const cors = require('cors')

//app set up
const app = express();
const PORT = process.env.PORT || '4000';

app.get("/", (req,res) => {
    res.send({ response: "Server is up and running. BABYYY" }).status(200);
})

app.use(cors);

//creating server
const server = app.listen(PORT, () => {
    console.log('server running on Port, ', PORT)
})

//socket set up
const io = socket(server);


io.on('connection', (socket) => {

    socket.on('join', ({host, room, user}) => {
        if(room){
            console.log(`room: ${room}, user: ${user}`)
             socket.join(room);  
             io.to(room).emit('message', {username: 'admin', text: `${user} has joined the room ----> ${room}`})
        }
    }) 

    // //new Time Value; 
    // socket.on('newTime', ({time, user, room, type}) => {
    //     if(type == 'pause'){
    //         socket.broadcast.to(room).emit('message', {username: 'admin', text: `${user} paused time ${time}`})
    //         socket.broadcast.to(room).emit('pauseTime', {newTime: time, user, type: type})
    //     }else{
    //         socket.broadcast.to(room).emit('message', {username: 'admin', text: `${user} changed the time to ${time}`})
    //         socket.broadcast.to(room).emit('refreshTime', {newTime: time, user, type: type});
    //     }
    // })

    //new Message; 
    socket.on('newMessage', ({user, newMessage, room}) => {
        console.log(`MESSASGE -> room: ${room}, user: ${user}`)
        io.sockets.in(room).emit('message', {username: user, text: newMessage})
    })

    socket.on('disconnect', () => {
       // io.to(room).emit('message', {username: 'admin', text: `${username} has left the room`})
        console.log('user has disconnected')
    })
})
