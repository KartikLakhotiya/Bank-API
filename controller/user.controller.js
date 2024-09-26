import User from "../models/users.model.js"
import { createAccount } from "./accounts.controller.js";

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
    const { firstName, lastName, email } = req.body;
    try {
        const user = new User({
            firstName,
            lastName,
            email
        })
        const saveduser = await user.save();
        const account = await createAccount(saveduser.id);
        saveduser.accountId = account;
        console.log(`User Created ${saveduser.firstName}`);
        await saveduser.save();
        res.status(201).json(saveduser)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
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