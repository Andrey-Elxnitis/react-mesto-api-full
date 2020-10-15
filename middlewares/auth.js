const jwt = require('jsonwebtoken');
const NotFoundErr = require('../errors/NotFoundErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
    );
  } catch (err) {
    throw new NotFoundErr({ message: 'Что-то не так с авторизацией' });
  }

  req.user = payload;
  next();
};
