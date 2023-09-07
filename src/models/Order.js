const mongoose = require('mongoose');
const { type } = require('os');
const { Schema } = mongoose;

const orderSchema = new Schema({
    total: Number,
    subTotal: Number,
    iva: {
        type: Number,
        default: 0 // Siempre en grone.
    },

    status: {
        type: String,
        enum: ['APPROVED', 'PENDING', 'REJECTED']
    },
    paymentType: {
        type: String,
        enum: ['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'CHECK', 'BANK_TRANSFER']
    },
    check: [{ type: Schema.Types.ObjectId, ref: 'Check' }],
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],

    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
