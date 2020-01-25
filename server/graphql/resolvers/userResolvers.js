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

const findOrCreate = async (model, find, create) => {
  let found = await model.findOne(find);
  if (!found) found = await model.create(create);
  return found;
};

module.exports = {
  Query: {
    user: async (parent, { id }, { models: { userModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      if (!validateId(id)) {
        throw new UserInputError('Bad Id');
      }
      const user = await userModel
        .findById({ _id: id })
        .populate('games.song')
        .populate('games.offered')
        .populate('favourites');
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
        favourites: [],
      });
      return foundUser;
    },
    clearGameHistory: async (
      parent,
      args,
      { models: { userModel, songModel }, me },
      info
    ) => {
      const clearedUser = await userModel.findOneAndUpdate(
        { _id: me.id },
        { $set: { games: [] } },
        { new: true }
      );
      return clearedUser;
    },
    addGame: async (
      parent,
      { win, tries, song, offered },
      { models: { userModel, songModel }, me },
      info
    ) => {
      const { reference, title, artist } = song;
      if (!validateId(me.id)) {
        throw new UserInputError('Bad Id');
      }
      // getting id of song
      const foundSong = await findOrCreate(
        songModel,
        { reference, artist, title },
        {
          reference,
          artist,
          title,
          listened: 0,
          favourited: 0,
        }
      );
      // getting id of songs
      const foundOffered = await Promise.all(
        offered.map(async el => {
          const { reference, title, artist } = el;
          const foundSong = await findOrCreate(
            songModel,
            { reference, artist, title },
            {
              reference,
              artist,
              title,
              listened: 0,
              favourited: 0,
            }
          );
          return foundSong;
        })
      );
      // add theese ids to user
      const userWithNewGame = await userModel
        .findOneAndUpdate(
          { _id: me.id },
          {
            $push: {
              games: {
                win,
                tries,
                song: foundSong._id,
                offered: foundOffered.map(el => el._id),
              },
            },
          },
          { new: true }
        )
        .populate('games.song')
        .populate('games.offered')
        .populate('favourites');
      // return user with dereferenced id
      return userWithNewGame;
    },
    addFavourites: async (
      parent,
      { id },
      { models: { userModel, songModel }, me },
      info
    ) => {
      if (!validateId(me.id)) {
        throw new UserInputError('Bad Id');
      }
      await songModel.findOneAndUpdate(
        { _id: id },
        { $inc: { favourited: 1 } }
      );
      const favourite = await userModel
        .findOneAndUpdate(
          { _id: me.id },
          { $addToSet: { favourites: id } },
          { new: true }
        )
        .populate('games.song')
        .populate('games.offered')
        .populate('favourites');
      return favourite;
    },
    deleteFavourites: async (
      parent,
      { id },
      { models: { userModel }, me },
      info
    ) => {
      if (!validateId(me.id)) {
        throw new UserInputError('Bad Id');
      }
      const deletedFavourite = await userModel
        .findOneAndUpdate(
          { _id: me.id },
          { $pull: { favourites: id } },
          { new: true }
        )
        .populate('games.song')
        .populate('games.offered')
        .populate('favourites');
      return deletedFavourite;
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
