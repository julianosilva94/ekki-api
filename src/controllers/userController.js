const express = require('express');

const authMiddleware = require('../middlewares/auth');

const User = require('../models/user');

const router = express.Router();

router.use(authMiddleware);

router.get('/balance', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('+balance');

    return res.send({ balance: user.balance });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.get('/contacts', async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    return res.send({ contacts: user.contacts });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.get('/contacts/:contactId', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const contact = user.contacts.find(c => c === req.params.contactId);

    if (!contact) {
      return res.status(400).send({ error: 'Error' });
    }

    return res.send({ contact });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.post('/contacts', async (req, res) => {
  try {
    // eslint-disable-next-line object-curly-newline
    const { user } = req.body;

    if (user === req.userId) {
      return res.status(400).send({ error: 'Error' });
    }

    const contact = await User.findById(user);

    if (!contact) {
      return res.status(400).send({ error: 'Error' });
    }

    const userLogged = await User.findById(req.userId);

    if (userLogged.contacts.includes(user)) {
      return res.status(400).send({ error: 'Error' });
    }

    // eslint-disable-next-line no-underscore-dangle
    user.contacts.push(user);

    await userLogged.save();

    return res.send({ contacts: userLogged.contacts });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.delete('/contacts/:contactId', async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    user.contacts.remove(req.params.contactId);

    await user.save();

    return res.send({ contacts: user.contacts });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

module.exports = app => app.use('/user', router);
