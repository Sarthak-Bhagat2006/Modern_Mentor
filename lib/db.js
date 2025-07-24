import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // must be at the top
const MONGO_URL = process.env.MONGO_URL;

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URL);
        console.log(`Connected to MongoDB`);
    } catch (err) {
        console.error(" MongoDB connection error:", err);
    }
}



