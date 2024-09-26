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

        res.status(200).json({ message: "Amount deposited successfully", account });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}