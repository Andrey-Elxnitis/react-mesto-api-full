const jwt = require('jsonwebtoken');
const AuthorizationErr = require('../errors/AuthorizationErr');

const { NODE_ENV, JWT_SECRET } = process.env;

// при успешной авторизации записываем токен
module.exports = (req, res, next) => {
  // достаем заголовок авторизации
  const { authorization } = req.headers;

  // проверяем его наличие
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationErr({ message: 'Что-то не так с авторизацией' });
  }

  // достаем токен из заголовка
  const token = authorization.replace('Bearer ', '');
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
