import { signupService, loginService, generateToken } from "../services/auth.service.js";

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const user = await signupService({ name, email, password });


        const token = generateToken(user._id);


        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await loginService({ email, password });


        const token = generateToken(user._id);

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(400).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie("accessToken", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: "Logged out successfully" });
};

export const getProfile = (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
