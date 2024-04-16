// make the necessary imports here
import mongoose from "mongoose";

// implement the below schema
const messageSchema = new mongoose.Schema({
    username: String,
    text: String,
    room: Number, 
    timestamp: Date
});

export const messageModel = mongoose.model("message", messageSchema);





