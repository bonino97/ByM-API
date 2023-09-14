const { Transaction } = require('mongodb');
const mongoose = require('mongoose');
const { type } = require('os');
const { Schema } = mongoose;

const DailyTransactionsSchema = new Schema({

    total: Number,
    subTotal: Number,
    iva: {
        type: Number,
        default: 0 // Siempre en grone.
    },
    status: {
        type: String,
        enum: ['PAID', 'DEBITED']
    },
    paymentType: {
        type: String,
        enum: ['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'CHECK', 'BANK_TRANSFER']
    },
    check: [{ type: Schema.Types.ObjectId, ref: 'Check' }],
    description: String,
    client: {
        type: String,
        required: true
    },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

module.exports = mongoose.model('DailyTransactions', DailyTransactionsSchema);
