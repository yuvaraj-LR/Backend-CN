import mongoose from "mongoose"

const chatSchema = new mongoose.Schema({
    username: String,
    message: String,
    timeStramp: Date
});

export const chatModel = mongoose.model("chat", chatSchema);