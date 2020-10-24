const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflickErr = require('../errors/ConflictErr');
const { templateName, templateAbout, templateAvatar } = require('../data/dataUser');

const { NODE_ENV, JWT_SECRET } = process.env;

// по запросу возвращаем всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr({ message: 'Упс, такого пользователя нет' });
      }
      res.send(user);
    })
    .catch(next);
};

// по запросу возвращаем пользователя по id
const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundErr({ message: 'Упс, пользователя с таким id не существует' });
      }
      res.status(200).send(user);
    })
    .catch(next);
};

// по запросу создаем пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name: name || templateName,
      about: about || templateAbout,
      avatar: avatar || templateAvatar,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflickErr({ message: 'Пользователь с таким email уже есть, введите другой email' });
      } else next(err);
    })
    .then((user) => res.status(201).send({ message: `Пользователь с email: ${user.email} зарегистрирован` }))
    .catch(next);
};

// авторизация пользователя
const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // здесь создаем токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

// при запросе обновляем данные пользователя
const changeUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr({ message: 'Переданы не корректные данные' });
      } else next(err);
    })
    .catch(next);
};

// при запросе обновляем аватар пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr({ message: 'Переданы не корректные данные' });
      } else next(err);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  changeUser,
  updateUserAvatar,
  login,
  getUser,
};
