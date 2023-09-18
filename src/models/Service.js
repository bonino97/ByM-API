const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
    model: String,
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    patent: String,
    owner: String,
    km: String,
    oilFilter:{
        changed: Boolean,
        // type: String,
    },
    airFilter: {
        changed: Boolean,
        reviewed: Boolean,
        // type: String,
    },
    fuelFilter: {
        changed: Boolean,
        // type: String,
    },
    motorOil: {
        changed:Boolean,
        density: String,
        // type: String,
    },
    gearboxOil: {
        changed:Boolean,
        reviewed: Boolean,
        // type: String,
    },
    steeringOil: {
        changed:Boolean,
        reviewed: Boolean,
        // type: String,
    },
    others: String,
    nextService: String,
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);