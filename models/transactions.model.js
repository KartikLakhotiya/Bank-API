import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['withdrawal', 'deposit', 'transfer']
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    toAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;