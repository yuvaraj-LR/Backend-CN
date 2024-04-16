import mongoose from "mongoose"

export const connect = async() => {
    await mongoose.connect("mongodb://localhost:27017/chatapp");
    console.log("Db connected successfully.");
}
