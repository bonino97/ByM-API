const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
    model: String,
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    patent: String,
    address: String,
    oilFilter:String,
    airFilter:String,
    fuelFilter: String,
    oilType: String,
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);