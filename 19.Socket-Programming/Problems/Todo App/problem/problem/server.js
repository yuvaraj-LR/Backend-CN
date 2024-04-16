// Complete the server.js file to make user's add, delete and update the todos.
import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"

import Task from "./task.schema.js";

const app = express();

// 1. Create server using http;
export const server = http.createServer(app);

// 2. Create socket server.
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET", "POST"]
    }
});

// 3. Use the socket events.
io.on("connect", (socket) => {
    console.log("Client has connected.");

    socket.on("new_message", (message) => {
        let messageObject = {
            message: message,
            createAt: new Date()
        }

        const newChat = new Task({
            text: message,
            createAt: new Date()
        })

        newChat.save();

        // Broadcast the message.
        socket.broadcast.emit("broadcast_message", messageObject);

        // Load previous messages.
        Task.find().sort().limit(50)
            .then(messages => {
                socket.emit("load_messages", messages)
            })
            .catch(err => {
                console.log(err);
            })
    });

    

    socket.on("disconnect", () => {
        console.log("Client has disconnected.");
    })
})