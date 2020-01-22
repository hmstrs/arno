const { isEmpty, isLength, isEmail } = require('./validator');
const EMAIL_INCORRECT = 'Введите правильную почту';
const FIELD_REQUIRED = 'Это поле обязательно';
const PASSWORD_LENGTH = 'Количество символов должно быть между 6 и 30';

const validateLogin = ({ email, password }) => {
  const errors = {};
  if (isEmpty(password)) errors.password = FIELD_REQUIRED;

  if (!isLength(password, { min: 6, max: 30 }))
    errors.password = PASSWORD_LENGTH;

  if (!isEmail(email)) errors.email = EMAIL_INCORRECT;
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLogin;
