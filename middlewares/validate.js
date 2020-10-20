const { CelebrateError } = require('celebrate');
const validator = require('validator');

// проверяем ссылки, которые нам присылают
const validatorLink = (value) => {
  console.log(value);
  if (!validator.isURL(value)) {
    throw new CelebrateError('invalid URL');
  }
  return value;
};

module.exports = {
  validatorLink,
};
