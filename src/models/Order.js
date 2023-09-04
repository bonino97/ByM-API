const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    total: Number,
    subTotal: Number,
    iva: {
        type: Number,
        default: 0 // Siempre en grone.
    },

    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    seller: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
