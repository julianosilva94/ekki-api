const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

function generateJWT(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 84600 * 30,
  });
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'E-mail already registered' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });

    user.password = undefined;

    const token = generateJWT({ id: user.id });

    const userJson = user.toObject();
    userJson.jwt = token;

    return res.send({ user: userJson });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +balance');

  if (!user) {
    return res.status(400).send({ error: 'E-mail/password wrong' });
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'E-mail/password wrong' });
  }

  const token = generateJWT({ id: user.id });

  user.password = undefined;

  const userJson = user.toObject();
  userJson.jwt = token;

  return res.send({ user: userJson });
});

module.exports = app => app.use('/auth', router);
