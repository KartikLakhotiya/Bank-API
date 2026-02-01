import mongoose from "mongoose";
import Transaction from "../models/transactions.model.js";
import logger from "./logger.js";

export const createTransaction = async (fromAccountId, toAccountId, amount) => {
    logger.info('TransactionService', 'Creating new transaction', { fromAccountId, toAccountId, amount });
    
    const transactionData = {
        type: 'transfer',
        accountId: fromAccountId,
        toAccountId,
        amount
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();
    
    logger.success('TransactionService', 'Transaction created successfully', { 
        transactionId: transaction._id, 
        type: 'transfer',
        amount 
    });
    logger.db('INSERT', 'Transactions', { transactionId: transaction._id, type: 'transfer' });

    return transaction;
}