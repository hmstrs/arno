const { gql } = require('apollo-server-koa');

module.exports = gql`
  type Response {
    artist: String!
    title: String!
  }

  extend type Query {
    recogniseByBase64(audio: String!): Response!
    recogniseByLyrics(lyrics: String!): Response!
    getTrackID(artist: String!, track: String!): Int!
  }
`;

// recogniseByHumming(humming: String!): Object!
