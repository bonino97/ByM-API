const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    address: String,
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);