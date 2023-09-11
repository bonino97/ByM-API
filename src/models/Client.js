const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    email: String,
    location: String,
    address: String,
    cuit: {
        type: String,
        unique: true,
        // required: true
    },
    
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);


