const mongoose = require('mongoose');
const { Schema } = mongoose;

const chequeSchema = new Schema({
  chequeNumber: String,
  bank: String,
  amount: Number, 
  drawer: String, //librador
  deliveredBy: String, //entregado
  expiredDate: Date, //vencimiento
  cuit: String,
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  status: {
    type: String,
    enum: ['PENDING', 'DELIVERED', 'COLLECTED', 'DEPOSITED'],
  },
  bankPlace: String, //plaza de cuenta
},{
  timestamps: true
}
);

module.exports = mongoose.model('Cheque', chequeSchema);
