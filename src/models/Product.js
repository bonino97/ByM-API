const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    stock: Number,
    images: [String],
    
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },

    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
