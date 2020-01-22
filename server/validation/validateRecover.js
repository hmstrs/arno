const { isEmpty, isEmail } = require('./validator');
const EMAIL_INCORRECT = 'Введите правильную почту';

const validateRecover = ({ email }) => {
  const errors = {};

  if (!isEmail(email)) errors.email = EMAIL_INCORRECT;
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateRecover;
