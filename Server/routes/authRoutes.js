import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const authrouter = express.Router();


authrouter.post('/register', registerUser);
authrouter.post('/login', loginUser);
authrouter.post('/logout', logoutUser); 
export default authrouter;