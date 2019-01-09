const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

function generateJWT(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 84600,
  });
}

router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'E-mail already registered' });
    }

    const user = await User.create(req.body);

    user.password = undefined;

    const token = generateJWT({ id: user.id });

    return res.send({ user, jwt: token });
  } catch (err) {
    return res.status(400).send({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).send({ error: 'E-mail/password wrong' });
  }

  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'E-mail/password wrong' });
  }

  const token = generateJWT({ id: user.id });

  user.password = undefined;

  return res.send({ user, jwt: token });
});

module.exports = app => app.use('/auth', router);
