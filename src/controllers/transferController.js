const express = require('express');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const authMiddleware = require('../middlewares/auth');

const Transfer = require('../models/transfer');
const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const transfers = await Transfer.find({ $or: [{ from: req.userId }, { to: req.userId }] })
      .populate('from', 'name')
      .populate('to', 'name')
      .sort('-createdAt');

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
    const { to, value, usedCreditCard, password } = req.body;
    const convertedValue = parseInt(value, 10);

    let useCreditCard = false;

    if (req.userId === to) {
      return res.status(400).send({ error: 'Cannot send to yourself' });
    }

    if (convertedValue <= 0) {
      return res.status(400).send({ error: 'Amount need to be greater than 0' });
    }

    const userFrom = await User.findById(req.userId).select('+transfers +balance +password');

    if (userFrom.balance < convertedValue) {
      if (usedCreditCard) {
        useCreditCard = true;
      } else {
        return res.status(400).send({ error: 'Cannot send more money than have in balance, please use a credit card' });
      }
    }

    if (convertedValue >= 1000 && password) {
      if (!await bcrypt.compare(password, userFrom.password)) {
        return res.status(400).send({ error: 'Wrong password' });
      }
    }

    const userTo = await User.findById(to).select('+transfers +balance');

    const twoMinutesOld = moment(new Date()).subtract(2, 'minutes').toDate();
    const isoTwoMinutesOld = new Date(twoMinutesOld).toISOString();

    const equalTransfer = await Transfer.findOne({
      value,
      to,
      createdAt: {
        $gt: isoTwoMinutesOld,
      },
    });

    if (equalTransfer) {
      userFrom.transfers.remove(equalTransfer.id);
      userTo.transfers.remove(equalTransfer.id);
      await equalTransfer.remove();
    }

    const transfer = await Transfer.create({
      from: req.userId,
      to,
      value: convertedValue,
      usedCreditCard: useCreditCard,
    });

    // eslint-disable-next-line no-underscore-dangle
    userFrom.transfers.push(transfer);
    userTo.transfers.push(transfer);

    if (!equalTransfer) {
      if (useCreditCard) {
        userFrom.balance = 0;
      } else {
        userFrom.balance -= convertedValue;
      }

      userTo.balance += convertedValue;
    }

    await userFrom.save();
    await userTo.save();

    return res.send({ transfer, balance: userFrom.balance });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
});

module.exports = app => app.use('/transfers', router);
