const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthorizationErr = require('../errors/AuthorizationErr');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Упс, вы ввели некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 10,
    select: false,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^((http|https):\/\/)(www\.)?([\w\W\d]{1,})(\.)([a-zA-Z]{1,10})([\w\W\d]{1,})?$/.test(v);
      },
      message: 'Данная ссылка некорректная. Введите пожалуйста верную ссылку...',
    },
  },
});

// проверяем email и password на налчие в бд
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationErr({ message: 'Wrong Email or Password' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationErr({ message: 'Wrong Email or Password' });
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
