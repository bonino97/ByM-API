const mongoose = require('mongoose');
const { Schema } = mongoose;

const DailyTransactionsSchema = new Schema({
  total: Number,
  subTotal: Number,
  iva: {
    type: Number,
    default: 0 // Siempre en grone.
  },
  status: {
    type: String,
    enum: ['PAID', 'DEBITED' ]
  },
  paymentType: {
    type: String,
    enum: ['CASH', 'DEBIT_CARD', 'CREDIT_CARD', 'CHECK', 'BANK_TRANSFER', 'OTHER'],
    default: 'OTHER'
  },
  check: [{ type: Schema.Types.ObjectId, ref: 'Check' }],
  description: String,
  client: {
    type: String,
    required: true
  },
  seller: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

// Agregamos un pre-save hook para manejar el caso de paymentType
DailyTransactionsSchema.pre('save', function (next) {
  if (this.status !== 'PAID') {
    // Si status no es "PAID", eliminamos paymentType
    this.paymentType = undefined;
  }
  next();
});

module.exports = mongoose.model('DailyTransactions', DailyTransactionsSchema);
