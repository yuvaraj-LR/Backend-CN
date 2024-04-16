import express from 'express';
import {Server} from 'socket.io';
import cors from 'cors';
import http from 'http';
import { connect } from './config/db.js';
import { chatModel } from './chat.model.js';

const app = express();

// 1. Creating server using http.
const server = http.createServer(app);

// 2. Create socket server.
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET", "POST"]
    }
});

// 3. Use socket events.
io.on('connect', (socket)=>{
    console.log("Connection is established");

    // Get the user's name.
    socket.on("join", (name) => {
        socket.username = name;

        // Get the old messages from DB.
        chatModel.find().sort({timestamp: 1}).limit(50)
            .then(messages => {
                socket.emit("load_messages", messages)
            }).catch(err => {
                console.log(err);
            })
    })

    socket.on("new_message", (message) => {
        // Make the user message object for displaying both name and message.
        let messageObject = {
            username : socket.username,
            message: message
        }

        const newChat = new chatModel({
            username: socket.username,
            message: message,
            timeStramp: new Date()
        });

        newChat.save();

        // Broadcast the message.
        socket.broadcast.emit("broadcast_message", messageObject);
    })

    socket.on('disconnect', ()=>{
        console.log("Connection is disconnected");
    })
});

server.listen(3000, ()=>{
    console.log("App is listening on 3000");
    connect();
})
