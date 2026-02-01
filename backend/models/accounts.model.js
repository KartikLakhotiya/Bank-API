import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0
    },
    credit: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'Credit must be a positive number.'
        }
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
})

const Account = mongoose.model('Account', accountSchema);

export default Account;