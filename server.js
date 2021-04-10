const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin , getCurrentUser , userLeave , getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//joining public
app.use(express.static(path.join(__dirname, 'public')));

const lkbot = 'lk Bot';

//after client connects
io.on('connection', socket => {

    socket.on('joinroom', ({username,room}) =>{

        const user = userJoin(socket.id , username,room);

        socket.join(user.room);

    //Welcome current user
    socket.emit('message', formatMessage(lkbot ,'Welcome to lk-chatapp'));            //only to the connecting client


    //to broadcast that a user just connected
    socket.broadcast.to(user.room).emit(
        'message',
        formatMessage(lkbot ,`${user.username} joined the chat`)
        );                                                           ///to everyone except the connecting user in the room

        // users list and room info
        io.to(user.room).emit('roomUsers' ,
        {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });




    ///Listen for chat msg 
    socket.on('chatMessage', msg =>{

        const user = getCurrentUser(socket.id);
        if(user.room != null){
        io.to(user.room).emit('message', formatMessage(user.username ,msg)); 
    }
    }); 

    // to broadcast that A user disconnected
    socket.on('disconnect', () => {
            
            const user = userLeave(socket.id);

            if(user){

            io.to(user.room).emit(
                'message',
                formatMessage(lkbot ,`${user.username} left the chat`)              //to everyone in room
                );  
             
        // users list and room info
        io.to(user.room).emit('roomUsers' ,
        {
            room: user.room,
            users: getRoomUsers(user.room)
        });   
                
            
            
        }
    });

    
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//28.38 https://www.youtube.com/watch?v=jD7FnbI76Hg
// io.to(user.room).emit('message', formatMessage(lkbot ,`${user.username} left the chat`));