import User from "../models/users.model.js"
import bcrypt from 'bcrypt';
import { createAccount } from "../utils/createAccount.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookies.js";
import Account from "../models/accounts.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}


export const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        generateTokenAndSetCookie(res, user._id);
        const saveduser = await user.save();
        const account = await createAccount(saveduser.id, saveduser.firstName);
        saveduser.accountId = account;

        //jwt

        console.log(`User Created ${saveduser.firstName}`);
        await saveduser.save();
        res.status(201).json(saveduser)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        // console.log(user)
        if (!user) return res.status(404).json({ message: "User not found." })
        const isPasswordValid = await bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        generateTokenAndSetCookie(res, user._id);
        // console.log(user.accountId);
        const account = await Account.findOne(user.accountId);
        user.lastLogin = new Date();
        await user.save();
        console.log(`User ${user.firstName} logged in.`)
        res.status(200).json({
            success: "true",
            message: `User ${user.firstName} Logged in Successfully`,
            user: {
                ...user._doc,
                password: undefined,
                balance: account.balance,
                lastLogin: user.lastLogin
            },

        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: error, success: false });
    }

}

export const logout = async (req, res) => {
    const loggedInUser = await User.findById(req.userId).select("-password");
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'None',
        path: '/'
    })
    console.log(`User ${loggedInUser.firstName} Logged Out`);
    res.status(200).json({ success: true, message: `User ${loggedInUser.firstName}Logged out successfully.` });
}

export const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}