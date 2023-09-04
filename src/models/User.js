const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: String,
    phone: String,
    userName: String,
    password: String,
    role: {
        type: String,
        enum: ['EMPLOYEE', 'SUPER_ADMIN'],
        default: 'EMPLOYEE'
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
