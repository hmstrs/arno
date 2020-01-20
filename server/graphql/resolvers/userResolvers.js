/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-koa');
const { genPass, sendMail } = require('../../common');

module.exports = {
  Query: {
    user: async (parent, { id }, { models: { userModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const user = await userModel.findById({ _id: id }).exec();
      return user;
    },
    login: async (parent, { name, password }, { models: { userModel } }, info) => {
      const user = await userModel.findOne({ name }).exec();

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
    createUser: async (parent, { name, password, email }, { models: { userModel } }, info) => {
      const user = await userModel.create({ name, password, email });
      return user;
    },
    addGame: async (parent, {id}, { models: { userModel } }, info) => {
      const game = await userModel.findOneAndUpdate({_id: id})
      return game;
    },
    addFavourites: async (parent, {id}, { models: { userModel } }, info) => {
      const favourite = await userModel.findOneAndUpdate({_id: id})
      return favourite;
    },
    resetPassword: async (parent, { email }, { models: { userModel } }, info) => {
      const regeneratedPassword = genPass(process.env.PASSWORD_LENGTH, process.env.CHARS.split(''));
      await userModel.findOneAndUpdate(
        { email }, 
        { password: regeneratedPassword }
      ).exec();
      await sendMail({ email, regeneratedPassword });
      return null;
    },
  },

};
