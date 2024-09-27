import { createTransaction } from "../utils/createTrasaction.js";
import Account from "../models/accounts.model.js";
import Transaction from "../models/transactions.model.js";

export const depositCash = async (req, res) => {
    try {
        const { userId, accountId, amount } = req.body;
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
            return res.status(404).json({ message: "Account Not Found" });
        }

        const transaction = new Transaction({
            type: 'deposit',
            amount,
            accountId
        });
        await transaction.save();
        account.transactions.push(transaction._id);
        await account.save();

        res.status(200).json({ message: "Amount deposited successfully", account });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

export const withdraw = async (req, res) => {
    try {
        const { userId, accountId, amount } = req.body;
        const account = await Account.findOne({ _id: accountId, userId });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.balance + account.credit < amount) {
            return res.status(400).json({ message: 'Insufficient Funds' });
        }

        const newBalance = account.balance - amount;
        const updatedAccount = await Account.findOneAndUpdate(
            { _id: accountId, userId },
            { balance: newBalance },
            { new: true }
        )

        const transaction = new Transaction({
            type: 'withdrawal',
            amount,
            accountId
        })
        await transaction.save();
        account.transactions.push(transaction._id);
        await account.save();

        res.status(200).json({ message: 'Cash withdrawn successfully', account: updatedAccount });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

export const updateCredit = async (req, res) => {
    try {
        const { userId, accountId, amount } = req.body;
        const account = await Account.findOneAndUpdate(
            { _id: accountId, userId },
            { $inc: { credit: amount } },
            { new: true, runValidators: true }
        );

        if (!account) {
            return res.status(404).json({ message: "Account/User Not found" })
        }

        res.status(200).json({ message: "Credit Updated Successfully", account });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

export const transferFunds = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount } = req.body;

        const fromAccount = await Account.findById(fromAccountId);
        const toAccount = await Account.findById(toAccountId);

        if (!fromAccount) {
            return res.status(404).json({ message: 'From account not found' });
        }

        if (!toAccount) {
            return res.status(404).json({ message: 'To account not found' });
        }

        const totalBalance = fromAccount.balance + fromAccount.credit;
        if (totalBalance < amount) {
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

        res.status(200).json({
            message: "Transfer completed Successfully",
            fromAccount: fromAccountId,
            toAccount: toAccountId,
            amount
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }

}