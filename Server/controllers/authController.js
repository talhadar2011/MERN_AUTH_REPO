import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';



export const registerUser = async(req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body,"body");
    try {
        //if any field is missing
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        console.log(user,"user");
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
              maxAge: 3600000 }); // 1 hour
        // Save user to DB
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error,"error");
        res.status(500).json({ message: "Server error" });
    }   
}

export const loginUser = async(req, res) => {
    const { email, password } = req.body; 
    try {
        //if any field is missing
        if (!email || !password) {  
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if user exists 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
                console.log(user,"user");

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch,"isMatch");
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
              maxAge: 3600000 });
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error,"error");
        res.status(500).json({ message: "Server error" });
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    res.status(200).json({ message: "Logout successful" });
}