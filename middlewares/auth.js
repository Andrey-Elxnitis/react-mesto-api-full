const jwt = require('jsonwebtoken');
const AuthorizationErr = require('../errors/AuthorizationErr');

const { NODE_ENV, JWT_SECRET } = process.env;

// при успешной авторизации записываем токен
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
    );
  } catch (err) {
    throw new AuthorizationErr({ message: 'Что-то не так с авторизацией' });
  }

  req.user = payload;
  next();
};
