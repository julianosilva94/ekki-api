/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
const mongoose = require('../database');

const User = require('./user');

const ContactSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

ContactSchema.pre('remove', async function (next) {
  const owner = await User.findOne(this.owner);

  owner.creditCards.remove(this._id);

  next();
});

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
