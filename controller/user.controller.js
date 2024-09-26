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
        await saveduser.save();
        res.status(201).json(saveduser)
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}