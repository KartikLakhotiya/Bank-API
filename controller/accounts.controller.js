import Account from "../models/accounts.model.js";
import logger from "../utils/logger.js";

export const getAllAccounts = async (req, res) => {
    try {
        logger.info('AccountController', 'Fetching all accounts');
        const accounts = await Account.find();
        logger.success('AccountController', `Retrieved ${accounts.length} accounts successfully`);
        logger.db('FIND', 'Accounts', { count: accounts.length });
        res.status(200).json(accounts);
    }
    catch (error) {
        logger.error('AccountController', 'Failed to fetch all accounts', error);
        res.status(500).json({ message: error });
    }
}

export const getAccountById = async (req, res) => {
    const id = req.params.id;
    try {
        logger.info('AccountController', 'Fetching account by ID', { accountId: id });
        
        const account = await Account.findById(id);
        if (!account) {
            logger.warn('AccountController', 'Account not found', { accountId: id });
            return res.status(404).json({ message: "Account not found" });
        }
        
        logger.success('AccountController', 'Account retrieved successfully', { 
            accountId: id, 
            firstName: account.firstName, 
            balance: account.balance 
        });
        logger.db('FIND_BY_ID', 'Accounts', { id, balance: account.balance });
        res.status(200).json(account);
    } catch (error) {
        logger.error('AccountController', 'Failed to fetch account by ID', error);
        res.status(500).json({ message: error });
    }
}

export const checkBalance = async (req, res) => {
    const { accountId } = req.body;
    try {
        logger.info('AccountController', 'Balance check requested', { accountId });
        
        const account = await Account.findById(accountId);
        if (!account) {
            logger.warn('AccountController', 'Account not found for balance check', { accountId });
            return res.status(404).json({ message: "Account not found" });
        }
        
        logger.success('AccountController', 'Balance retrieved successfully', { 
            accountId, 
            firstName: account.firstName, 
            balance: account.balance 
        });
        
        res.status(200).json({
            message: "Account balance fetched successfully.",
            firstName: account.firstName,
            balance: account.balance
        });
    } catch (error) {
        logger.error('AccountController', 'Failed to check balance', error);
        res.status(500).json({ message: error });
    }
}