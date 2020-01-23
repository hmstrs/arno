/* eslint-disable no-unused-vars */
const fetch = require('node-fetch');
const FormData = require('form-data');
const { UserInputError } = require('apollo-server-koa');

module.exports = {
  Query: {
    recogniseByBase64: async (parent, { audio }, context, info) => {
      const body = new FormData();
      body.append('audio', audio);
      body.append('api_token', process.env.AUDD_TOKEN);

      const response = await fetch(process.env.AUDD_LINK, {
        method: 'POST',
        body,
      })
        .then(res => res.json())
        .catch(err => {
          throw new UserInputError('error with Audd');
        });

      const { result, status } = response;
      if (status === 'error' || !result)
        throw new UserInputError('error with Audd');

      return result;
    },
    recogniseByLyrics: async (parent, { lyrics }, context, info) => {
      const body = new FormData();
      body.append('q', lyrics);
      body.append('api_token', process.env.AUDD_TOKEN);

      const response = await fetch(process.env.AUDD_LYRICS, {
        method: 'POST',
        body,
      })
        .then(res => res.json())
        .catch(err => {
          throw new UserInputError('error with Audd');
        });
      const { result, status } = response;
      if (status === 'error' || !result)
        throw new UserInputError('error with Audd');
      //пока так :)
      const offered = result[0];

      return offered;
    },
    getTrackID: async (parent, { artist, track }, context, info) => {
      const response = await fetch(
        `${process.env.DEEZER_SEARCH_LINK}artist:"${encodeURIComponent(
          artist
        )}" track:"${encodeURIComponent(track)}"`
      ).then(res => res.json());
      const { data } = response;

      if (data && data.length > 0) {
        const { id } = data[0];
        return id ? id : 0;
      } else return 0;
    },
    //   recogniseByHumming: async (parent, { humming }, context, info) => {
    //     const responce = await fetch(process.env.AUDD_HUMMING, {
    //       method: 'POST',
    //       body: { humming },
    //     }).then(res => res.json());
    //     return responce;
    //   },
  },
};
