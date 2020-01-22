/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError } = require('apollo-server-koa');
const { genPass, sendMail } = require('../../common');
const { validateLogin, validateRegister, validateRecover, validateId } = require('../../validation');

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
    login: async (parent, { email, password }, { models: { userModel } }, info) => {
      const { isValid, errors } = validateLogin({ email, password });
      if (!isValid) {
        throw new UserInputError('Login failed', { errors });
      }

      const user = await userModel.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const matchPasswords = bcrypt.compareSync(password, user.password);

      if (!matchPasswords) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT || 'secret');

      return {
        token,
      };
    },
  },

  Mutation: {
<<<<<<< HEAD
    createUser: async (parent, { name, password, email }, { models: { userModel } }, info) => {
      const { isValid, errors } = validateRegister({ name, email, password });
      if (!isValid) {
        throw new UserInputError('Registration failed', { errors });
      }
=======
    createUser: async (
      parent,
      { name, password, email },
      { models: { userModel } },
      info
    ) => {
>>>>>>> master
      let foundUser = await userModel.findOne({ email });
      if (!foundUser) {
        foundUser = await userModel.create({
          name,
          password,
          email,
          games: [],
        });
      }
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
<<<<<<< HEAD
    resetPassword: async (parent, { email }, { models: { userModel } }, info) => {
      const { isValid, errors } = validateRecover({ email });
      if (!isValid) {
        throw new UserInputError('Recover failed.', { errors });
      }
      const regeneratedPassword = genPass(process.env.PASSWORD_LENGTH, process.env.CHARS);
      await userModel.findOneAndUpdate(
        { email },
        { password: regeneratedPassword }
=======
    resetPassword: async (
      parent,
      { email },
      { models: { userModel } },
      info
    ) => {
      const regeneratedPassword = genPass(
        process.env.PASSWORD_LENGTH,
        process.env.CHARS
>>>>>>> master
      );
      const hashedPassword = bcrypt.hashSync(regeneratedPassword, 12);
      await userModel.findOneAndUpdate({ email }, { password: hashedPassword });
      await sendMail({ email, regeneratedPassword });
      return true;
    },
  },
};
