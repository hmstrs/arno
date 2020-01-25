const { gql } = require('apollo-server-koa');

module.exports = gql`
  type Response {
    artist: String!
    title: String!
    reference: String!
  }

  extend type Query {
    recogniseByBase64(audio: String!): [Response!]!
    recogniseByLyrics(lyrics: String!): [Response!]!
  }
`;

// recogniseByHumming(humming: String!): Object!
