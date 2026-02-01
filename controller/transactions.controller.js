import { createTransaction } from "../utils/createTrasaction.js";
import Account from "../models/accounts.model.js";
import Transaction from "../models/transactions.model.js";
import User from "../models/users.model.js";
import logger from "../utils/logger.js";

export const depositCash = async (req, res) => {
    try {
        const { userId, accountId, amount } = req.body;
        logger.info('TransactionController', 'Deposit request initiated', { userId, accountId, amount });
        
        const account = await Account.findOneAndUpdate(
            {
                _id: accountId, userId: userId
            },
            {
                $inc: { balance: amount }
            },
            { new: true }
        );

        if (!account) {
            logger.warn('TransactionController', 'Deposit failed - Account not found', { userId, accountId });
            return res.status(404).json({ message: "Account Not Found" });
        }

        const user = await User.findById(userId);

        const transaction = new Transaction({
            type: 'deposit',
            amount,
            accountId
        });
        await transaction.save();
        account.transactions.push(transaction._id);
        await account.save();

        logger.transaction('DEPOSIT', { 
            userId, 
            accountId, 
            amount, 
            newBalance: account.balance,
            transactionId: transaction._id,
            userName: user.firstName
        });
        logger.db('INSERT', 'Transactions', { type: 'deposit', amount, transactionId: transaction._id });
        
        res.status(200).json({ message: "Amount deposited successfully", account });
    }
    catch (error) {
        logger.error('TransactionController', 'Deposit failed', error);
        res.status(500).json({ message: error });
    }
}

export const withdraw = async (req, res) => {
    try {
        const { userId, accountId, amount } = req.body;
        logger.info('TransactionController', 'Withdrawal request initiated', { userId, accountId, amount });
        
        const account = await Account.findOne({ _id: accountId, userId });

        if (!account) {
            logger.warn('TransactionController', 'Withdrawal failed - Account not found', { userId, accountId });
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.balance + account.credit < amount) {
            logger.warn('TransactionController', 'Withdrawal failed - Insufficient funds', { 
                userId, 
                accountId, 
                requestedAmount: amount, 
                availableBalance: account.balance,
                credit: account.credit
            });
            return res.status(400).json({ message: 'Insufficient Funds' });
        }

        const newBalance = account.balance - amount;
        const updatedAccount = await Account.findOneAndUpdate(
            { _id: accountId, userId },
            { balance: newBalance },
            { new: true }
        )

        const user = await User.findById(userId);

        const transaction = new Transaction({
            type: 'withdrawal',
            amount,
            accountId
        })
        await transaction.save();
        account.transactions.push(transaction._id);
        await account.save();

        logger.transaction('WITHDRAWAL', { 
            userId, 
            accountId, 
            amount, 
            previousBalance: account.balance + amount,
            newBalance: updatedAccount.balance,
            transactionId: transaction._id,
            userName: user.firstName
        });
        logger.db('INSERT', 'Transactions', { type: 'withdrawal', amount, transactionId: transaction._id });
        
        res.status(200).json({ message: 'Cash withdrawn successfully', account: updatedAccount });
    }
    catch (error) {
        logger.error('TransactionController', 'Withdrawal failed', error);
        res.status(500).json({ message: error });
    }
}

export const updateCredit = async (req, res) => {
    try {
        const { userId, accountId, amount } = req.body;
        logger.info('TransactionController', 'Credit update request', { userId, accountId, amount });
        
        const account = await Account.findOneAndUpdate(
            { _id: accountId, userId },
            { $inc: { credit: amount } },
            { new: true, runValidators: true }
        );

        if (!account) {
            logger.warn('TransactionController', 'Credit update failed - Account not found', { userId, accountId });
            return res.status(404).json({ message: "Account/User Not found" })
        }

        logger.success('TransactionController', 'Credit updated successfully', { 
            userId, 
            accountId, 
            creditChange: amount,
            newCredit: account.credit
        });
        logger.db('UPDATE', 'Accounts', { accountId, field: 'credit', newValue: account.credit });
        
        res.status(200).json({ message: "Credit Updated Successfully", account });
    }
    catch (error) {
        logger.error('TransactionController', 'Credit update failed', error);
        res.status(500).json({ message: error });
    }
}

export const transferFunds = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount } = req.body;
        logger.info('TransactionController', 'Fund transfer initiated', { fromAccountId, toAccountId, amount });

        const fromAccount = await Account.findById(fromAccountId);
        const toAccount = await Account.findById(toAccountId);

        if (!fromAccount) {
            logger.warn('TransactionController', 'Transfer failed - Source account not found', { fromAccountId });
            return res.status(404).json({ message: 'From account not found' });
        }

        if (!toAccount) {
            logger.warn('TransactionController', 'Transfer failed - Destination account not found', { toAccountId });
            return res.status(404).json({ message: 'To account not found' });
        }

        const totalBalance = fromAccount.balance + fromAccount.credit;
        if (totalBalance < amount) {
            logger.warn('TransactionController', 'Transfer failed - Insufficient funds', { 
                fromAccountId, 
                requestedAmount: amount, 
                availableBalance: totalBalance 
            });
            return res.status(400).json({ message: "Insufficient Funds" });
        }

        await Account.findByIdAndUpdate(
            toAccountId,
            { $inc: { balance: amount } },
            { new: true }
        )

        const transaction = await createTransaction(fromAccountId, toAccountId, amount);

        fromAccount.transactions.push({
            _id: transaction.id,
            to: toAccountId,
            amount
        });

        toAccount.transactions.push({
            _id: transaction.id,
            from: fromAccountId,
            amount
        });

        await Promise.all([fromAccount.save(), toAccount.save()]);

        logger.transaction('TRANSFER', { 
            fromAccountId, 
            toAccountId, 
            amount,
            transactionId: transaction._id
        });
        logger.db('INSERT', 'Transactions', { type: 'transfer', fromAccountId, toAccountId, amount });
        
        res.status(200).json({
            message: "Transfer completed Successfully",
            fromAccount: fromAccountId,
            toAccount: toAccountId,
            amount
        });
    }
    catch (error) {
        logger.error('TransactionController', 'Fund transfer failed', error);
        res.status(500).json({ message: error });
    }

}

export const getUsersTransaction = async (req, res) => {
    try {
        const userId = req.params.userId;
        logger.info('TransactionController', 'Fetching user transactions', { userId });

        // Get all transactions for the user
        const transactions = await Transaction.find({ userId });
        
        logger.success('TransactionController', `Retrieved ${transactions.length} transactions`, { userId });
        logger.db('FIND', 'Transactions', { userId, count: transactions.length });

        res.json({ transactions });
    } catch (error) {
        logger.error('TransactionController', 'Failed to fetch user transactions', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}