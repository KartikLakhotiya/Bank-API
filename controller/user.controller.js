import User from "../models/users.model.js"
import bcrypt from 'bcrypt';
import { createAccount } from "../utils/createAccount.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookies.js";
import Account from "../models/accounts.model.js";
import logger from "../utils/logger.js";

export const getAllUsers = async (req, res) => {
    try {
        logger.info('UserController', 'Fetching all users');
        const users = await User.find().select("-password");
        logger.success('UserController', `Retrieved ${users.length} users successfully`);
        logger.db('FIND', 'Users', { count: users.length });
        res.status(200).json(users);
    }
    catch (error) {
        logger.error('UserController', 'Failed to fetch all users', error);
        res.status(500).json({ message: error });
    }
}


export const createUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        logger.info('UserController', 'Creating new user', { email, firstName, lastName });

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        logger.debug('UserController', 'Password hashed successfully');
        
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        generateTokenAndSetCookie(res, user._id);
        const saveduser = await user.save();
        logger.db('INSERT', 'Users', { id: saveduser._id, email: saveduser.email });
        
        const account = await createAccount(saveduser.id, saveduser.firstName);
        saveduser.accountId = account;

        logger.success('UserController', `User created successfully`, { 
            userId: saveduser._id, 
            email: saveduser.email, 
            accountId: account._id 
        });
        
        await saveduser.save();
        res.status(201).json({ ...saveduser._doc, password: undefined })
    }
    catch (error) {
        logger.error('UserController', 'Failed to create user', error);
        res.status(500).json({ message: error });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        logger.info('UserController', 'Login attempt', { email });
        
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('UserController', 'Login failed - User not found', { email });
            return res.status(404).json({ message: "User not found." })
        }
        
        const isPasswordValid = await bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            logger.warn('UserController', 'Login failed - Invalid password', { email, userId: user._id });
            logger.auth('LOGIN_FAILED', user._id, { reason: 'Invalid password' });
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        
        generateTokenAndSetCookie(res, user._id);
        const account = await Account.findOne(user.accountId);
        user.lastLogin = new Date();
        await user.save();
        
        logger.success('UserController', `User logged in successfully`, { userId: user._id, email: user.email });
        logger.auth('LOGIN_SUCCESS', user._id, { email: user.email, lastLogin: user.lastLogin });
        
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
        logger.error('UserController', 'Login error', error);
        res.status(500).json({ message: error, success: false });
    }

}

export const logout = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.userId).select("-password");
        
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'None',
            path: '/'
        })
        
        logger.success('UserController', `User logged out successfully`, { userId: loggedInUser._id, email: loggedInUser.email });
        logger.auth('LOGOUT', loggedInUser._id, { email: loggedInUser.email });
        
        res.status(200).json({ success: true, message: `User ${loggedInUser.firstName} Logged out successfully.` });
    } catch (error) {
        logger.error('UserController', 'Logout error', error);
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
}

export const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        logger.info('UserController', 'Fetching user by ID', { userId: id });
        
        const user = await User.findById(id);
        if (!user) {
            logger.warn('UserController', 'User not found', { userId: id });
            return res.status(404).json({ message: "User not found" });
        }
        
        logger.success('UserController', 'User retrieved successfully', { userId: id, email: user.email });
        logger.db('FIND_BY_ID', 'Users', { id });
        res.status(200).json(user);
    } catch (error) {
        logger.error('UserController', 'Failed to fetch user by ID', error);
        res.status(500).json({ message: error });
    }
}

export const checkAuth = (req, res) => {
    try {
        logger.info('UserController', 'Auth check requested', { userId: req.user?._id });
        logger.auth('AUTH_CHECK', req.user?._id, { status: 'authenticated' });
        res.status(200).json(req.user);
    } catch (error) {
        logger.error('UserController', 'Auth check failed', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}