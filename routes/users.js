const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserId,
  changeUser,
  updateUserAvatar,
} = require('../controllers/users.js');

// при запросе показываем список пользователей
router.get('/users', getUsers);

// при запросе показываем пользователя по id
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

// при запросе обновляем данные пользователя
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), changeUser);

// при запросе обновляем аватар пользователя
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }).unknown(true),
}), updateUserAvatar);

module.exports = router;
