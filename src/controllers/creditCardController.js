const express = require('express');

const authMiddleware = require('../middlewares/auth');

const CreditCard = require('../models/creditCard');
const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const creditCards = await CreditCard.find({ owner: req.userId });

    return res.send({ creditCards });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.get('/:cardId', async (req, res) => {
  try {
    const creditCard = await CreditCard.findOne({ _id: req.params.cardId, owner: req.userId });

    return res.send(creditCard);
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { number, expirationDate, holderName, securityCode } = req.body;

    const user = await User.findById(req.userId);

    const creditCard = await CreditCard.create({
      number,
      expirationDate,
      holderName,
      securityCode,
      owner: req.userId,
    });

    // eslint-disable-next-line no-underscore-dangle
    user.creditCards.push(creditCard);

    await user.save();

    return res.send(creditCard);
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.delete('/:cardId', async (req, res) => {
  try {
    const creditCard = await CreditCard.findOne({ _id: req.params.cardId, owner: req.userId });

    await creditCard.remove();

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

module.exports = app => app.use('/credit-cards', router);
