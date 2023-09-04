const mongoose = require('mongoose');
const { Schema } = mongoose;

const supplierSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    address: String,

    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Supplier', supplierSchema);
