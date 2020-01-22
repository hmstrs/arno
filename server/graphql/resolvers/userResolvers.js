/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError } = require('apollo-server-koa');
const { genPass, sendMail } = require('../../common');
const {
  validateLogin,
  validateRegister,
  validateRecover,
  validateId,
} = require('../../validation');

module.exports = {
  Query: {
    user: async (parent, { id }, { models: { userModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      if (!validateId(id)) {
        throw new UserInputError('Bad Id');
      }
      const user = await userModel.findById({ _id: id });
      return user;
    },
    login: async (
      parent,
      { email, password },
      { models: { userModel } },
      info
    ) => {
      const { isValid, errors } = validateLogin({ email, password });
      if (!isValid) {
        throw new UserInputError('Login failed', { errors });
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        throw new UserInputError('Login failed', {
          errors: {
            email: 'Такого пользователя не существует',
          },
        });
      }

      const matchPasswords = bcrypt.compareSync(password, user.password);

      if (!matchPasswords) {
        throw new UserInputError('Login failed', {
          errors: {
            password: 'Укажите правильный пароль',
          },
        });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT || 'secret');

      return {
        token,
      };
    },
  },

  Mutation: {
    createUser: async (
      parent,
      { name, password, email },
      { models: { userModel } },
      info
    ) => {
      const { isValid, errors } = validateRegister({ name, email, password });
      if (!isValid) {
        throw new UserInputError('Registration failed', { errors });
      }
      let foundUser = await userModel.findOne({ email });
      if (foundUser) {
        throw new UserInputError('Registration failed', {
          errors: {
            email: 'Пользователь с такой почтой уже зарегистрирован',
          },
        });
      }
      foundUser = await userModel.create({
        name,
        password,
        email,
        games: [],
      });
      return foundUser;
    },
    addGame: async (parent, { id }, { models: { userModel } }, info) => {
      if (!validateId(id)) {
        throw new UserInputError('Bad Id');
      }
      const game = await userModel.findOneAndUpdate({ _id: id });
      return game;
    },
    addFavourites: async (parent, { id }, { models: { userModel } }, info) => {
      if (!validateId(id)) {
        throw new UserInputError('Bad Id');
      }
      const favourite = await userModel.findOneAndUpdate({ _id: id });
      return favourite;
    },
    resetPassword: async (
      parent,
      { email },
      { models: { userModel } },
      info
    ) => {
      const { isValid, errors } = validateRecover({ email });
      if (!isValid) {
        throw new UserInputError('Recover failed.', { errors });
      }
      const regeneratedPassword = genPass(
        process.env.PASSWORD_LENGTH,
        process.env.CHARS
      );
      const hashedPassword = bcrypt.hashSync(regeneratedPassword, 12);
      const updated = await userModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );
      if (!updated) {
        throw new UserInputError('Recover failed.', {
          errors: {
            email: 'Такого пользователя не существует',
          },
        });
      }
      await sendMail({ email, regeneratedPassword });
      return true;
    },
  },
};
