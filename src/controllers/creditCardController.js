const express = require('express');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    return res.send({ user: req.userId });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.get('/:cardId', async (req, res) => {
  try {
    return res.send({ user: req.userId });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    return res.send({ user: req.userId });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.put('/:cardId', async (req, res) => {
  try {
    return res.send({ user: req.userId });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

router.delete('/:cardId', async (req, res) => {
  try {
    return res.send({ user: req.userId });
  } catch (err) {
    return res.status(400).send({ error: 'Error' });
  }
});

module.exports = app => app.use('/credit-cards', router);
