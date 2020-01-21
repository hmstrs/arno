/* eslint-disable no-unused-vars */

module.exports = {
  Mutation: {
    addListened: async (parent, { reference }, { models: { songModel } }, info) => {
      const updatedCounter = songModel.findOneAndUpdate(
        { reference },
        { $inc: { listened: 1 } },
        { new: true }
      );
      return updatedCounter;
    },
    addFavorited: async (parent, { reference }, { models: { songModel } }, info) => {
      const updatedCounter = songModel.findOneAndUpdate(
        { reference },
        { $inc: { favourited: 1 } },
        { new: true }
      );
      return updatedCounter;
    },
    addSong: async (parent, { reference, artist, title }, { models: { songModel } }, info) => {
      let foundSong = await songModel.findOne({ reference });
      if (!foundSong) {
        foundSong = await songModel.create({
          reference,
          artist,
          title,
          listened: 0,
          favourited: 0
        });
      }
      return foundSong;
    },
  },
};
