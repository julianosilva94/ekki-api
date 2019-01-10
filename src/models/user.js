const bcrypt = require('bcryptjs');

const mongoose = require('../database');

const creditCard = require('./creditCard').schema;
const contact = require('./contact').schema;
const transfer = require('./transfer').schema;

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
  creditCards: {
    type: [creditCard],
    select: false,
  },
  contacts: {
    type: [contact],
    select: false,
  },
  transfers: {
    type: [transfer],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// eslint-disable-next-line func-names
UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
