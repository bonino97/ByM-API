const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    enum: ['EMPLOYEE', 'SUPER_ADMIN'],
    required: true
  },
});

module.exports = mongoose.model('Role', roleSchema);
