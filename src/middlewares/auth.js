const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || authorization === '') {
    return res.status(401).send({ error: 'Invalid JWT' });
  }

  jwt.verify(authorization, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid JWT' });

    req.userId = decoded.id;

    return next();
  });

  return true;
};
