const mongoose = require('../database');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  balance: {
    type: Number,
    select: false,
    default: 0,
  },
  creditCards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CreditCard',
  }],
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  transfers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transfer',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
