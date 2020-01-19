/* eslint-disable no-unused-vars */
const { AuthenticationError } = require('apollo-server-koa');

module.exports = {
  Query: {
    event: async (parent, { id }, { models: { eventModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const event = await eventModel.findById({ _id: id }).exec();
      return event;
    },
    events: async (parent, args, { models: { eventModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const events = await eventModel.find({ owner: me.id }).exec();
      return events;
    },
  },

  Mutation: {
    createEvent: async (parent, { title, content }, { models: { eventModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const event = await eventModel.create({ title, content, owner: me.id });
      return event;
    },
  },

  Event: {
    owner: async ({ owner }, args, { models: { userModel } }, info) => {
      const user = await userModel.findById({ _id: owner }).exec();
      return user;
    },
  },
};
