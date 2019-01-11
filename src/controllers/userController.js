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
    const user = await User.findById(req.userId).populate('contacts', 'name email');

    return res.send({ contacts: user.contacts });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.get('/contacts/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;

    const user = await User.findById(req.userId).populate('contacts', 'name email');
    const contact = user.contacts.find(c => c.id === contactId);

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
    const { userId } = req.body;

    if (userId === req.userId) {
      return res.status(400).send({ error: 'Error' });
    }

    const contact = await User.findById(userId).select('name email');
    if (!contact) {
      return res.status(400).send({ error: 'Error' });
    }

    const userLogged = await User.findById(req.userId).populate('contacts', 'name email');

    const contacts = userLogged.contacts.map(c => c.id);
    if (contacts.includes(userId)) {
      return res.status(400).send({ error: 'Error' });
    }

    // eslint-disable-next-line no-underscore-dangle
    userLogged.contacts.push(userId);

    await userLogged.save();

    return res.send({ contact });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.delete('/contacts/:contactId', async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('contacts', 'name email');
    const { contactId } = req.params;

    const contacts = user.contacts.map(c => c.id);

    if (!contacts.includes(contactId)) {
      return res.status(400).send({ error: 'Error' });
    }

    user.contacts.remove(contactId);

    await user.save();

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

module.exports = app => app.use('/user', router);
