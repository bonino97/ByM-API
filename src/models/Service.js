const mongoose = require('mongoose');
const { Schema } = mongoose;


const serviceSchema = new Schema({
    patent: String,
    km: String,
    Date: Date,
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    oilFilter:{
        changed: Boolean,
    },
    airFilter: {
        changed: Boolean,
        reviewed: Boolean,
    },
    fuelFilter: {
        changed: Boolean,
    },
    motorOil: {
        changed:Boolean,
        density: String,
        OilType: String,
    },
    gearboxOil: {
        changed:Boolean,
        reviewed: Boolean,
        OilType: String,
    },
    steeringOil: {
        changed:Boolean,
        reviewed: Boolean,
        OilType: String,
    },
    others: String,
    nextService: {
        byKm: Number,
    },
}, {
    timestamps: true
});

// Calcula byKm después de definir km

module.exports = mongoose.model('Service', serviceSchema);