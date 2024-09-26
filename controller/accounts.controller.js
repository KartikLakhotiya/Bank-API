import Account from "../models/accounts.model.js";

export const createAccount = async (userId) => {
    try {
        const account = new Account({
            userId,
            balance: 0,
            credit: 0
        });
        const savedAccount = await account.save();
        return savedAccount;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}

export const getAccountById = async (req, res) => {
    const id = req.params.id;
    try {
        const account = await Account.findById(id);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.status(200).json(account);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}