/* eslint-disable no-unused-vars */
const fetch = require('node-fetch');

module.exports = {
  Query: {
    recogniseByLyrics: async (parent, { lyrics }, context, info) => {
      const responce = await fetch(
        process.env.AUDD_LYRICS, 
        { method: 'POST', body: { lyrics } }
      ).then(res => res.json());
      return responce;
    },
    recogniseByHumming: async (parent, { humming }, context, info) => {
      const responce = await fetch(
        process.env.AUDD_HUMMING, 
        { method: 'POST', body: { humming } }
      ).then(res => res.json());
      return responce;
    },
  },
};
