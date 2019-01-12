const express = require('express');

const authMiddleware = require('../middlewares/auth');

const Transfer = require('../models/transfer');
const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const transfers = await Transfer.find({ $or: [{ from: req.userId }, { to: req.userId }] })
      .populate('from', 'name')
      .populate('to', 'name');

    return res.send({ transfers });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.get('/:transferId', async (req, res) => {
  try {
    const transfer = await Transfer.findOne({
      _id: req.params.transferId,
      $and: [{ $or: [{ from: req.userId }, { to: req.userId }] }],
    });

    return res.send(transfer);
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { to, value, usedCreditCard } = req.body;
    const convertedValue = parseInt(value, 10);

    if (value <= 0 || req.userId === to) {
      return res.status(400).send({ error: 'Error' });
    }

    const userFrom = await User.findById(req.userId).select('+transfers +balance');

    if (userFrom.balance < convertedValue) {
      return res.status(400).send({ error: 'Error' });
    }

    const userTo = await User.findById(to).select('+transfers +balance');

    const transfer = await Transfer.create({
      from: req.userId,
      to,
      convertedValue,
      usedCreditCard,
    });

    // eslint-disable-next-line no-underscore-dangle
    userFrom.transfers.push(transfer);
    userFrom.balance -= convertedValue;

    // eslint-disable-next-line no-underscore-dangle
    userTo.transfers.push(transfer);
    userTo.balance += convertedValue;

    await userFrom.save();
    await userTo.save();

    return res.send({ transfer, balance: userFrom.balance });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

module.exports = app => app.use('/transfers', router);
