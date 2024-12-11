import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const validateUserInput = ({ name, email, password }) => {
    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }
    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
    }
};


export const signupService = async ({ name, email, password }) => {
    validateUserInput({ name, email, password });

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({ name, email, password: hashedPassword });
    return user;
};


export const loginService = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid email or password");
    }

    return user;
};


export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
};

export const verifyToken = async (token) => {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};