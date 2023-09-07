const mongoose = require('mongoose');
const { Schema } = mongoose;

const chequeSchema = new Schema({
  chequeNumber: String,
  bank: String,
  amount: Number, 
  drawer: String, //librador
  deliveredBy: String, //entregado
  expiredDate: Date, //vencimiento
},{
  timestamps: true
}
);

module.exports = mongoose.model('Cheque', chequeSchema);
