import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv/config';
import cookieParser from 'cookie-parser';
import  ProjectRoutes from './routes/projectRoutes.js';
import connectDB from './config/mongodb.js';
import authrouter from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use("/",ProjectRoutes);
app.use("/api/auth",authrouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
