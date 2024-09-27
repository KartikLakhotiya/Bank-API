import mongoose from "mongoose";
import Transaction from "../models/transactions.model.js";

export const createTransaction = async (fromAccountId, toAccountId, amount) => {
    const transactionData = {
        type: 'transfer',
        accountId: fromAccountId,
        toAccountId,
        amount
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    return transaction;
}