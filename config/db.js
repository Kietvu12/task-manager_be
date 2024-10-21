import mongoose from "mongoose";
export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://quynhanh:1@cluster0.wxc6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log("DB connect"))
}