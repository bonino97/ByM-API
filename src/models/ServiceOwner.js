const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceOwnerSchema = new Schema({
    associatedVehicle: {
        patent: String,
        brand: String,
        model: String,
        year: String,
    },
    owner:{
        ownerName: String,
        ownerPhone: String,
        ownerEmail: String,
        ownerAddress: String,
        ownerCity: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('ServiceOwner', serviceOwnerSchema);