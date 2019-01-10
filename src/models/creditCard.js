const mongoose = require('../database');

const CreditCardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  number: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  holderName: {
    type: String,
    required: true,
  },
  securityCode: {
    type: Number,
    required: true,
  },
});

const CreditCard = mongoose.model('CreditCard', CreditCardSchema);

module.exports = CreditCard;
