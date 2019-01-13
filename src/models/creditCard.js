/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const mongoose = require('../database');

const User = require('./user');

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
    type: String,
    required: true,
  },
  holderName: {
    type: String,
    required: true,
  },
  securityCode: {
    type: Number,
    required: true,
    select: false,
  },
});

CreditCardSchema.pre('remove', async function (next) {
  const owner = await User.findOne(this.owner);

  owner.creditCards.remove(this._id);

  next();
});

const CreditCard = mongoose.model('CreditCard', CreditCardSchema);

module.exports = CreditCard;
