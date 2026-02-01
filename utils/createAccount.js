import Account from "../models/accounts.model.js";
import logger from "./logger.js";

export const createAccount = async (userId, firstName) => {
    try {
        logger.info('AccountService', 'Creating new account', { userId, firstName });
        
        const account = new Account({
            userId,
            firstName,
            balance: 0,
            credit: 0
        });
        const savedAccount = await account.save();
        
        logger.success('AccountService', 'Account created successfully', { 
            accountId: savedAccount._id, 
            userId, 
            firstName 
        });
        logger.db('INSERT', 'Accounts', { accountId: savedAccount._id, userId });
        
        return savedAccount;
    }
    catch (error) {
        logger.error('AccountService', 'Failed to create account', error);
        throw error;
    }
}