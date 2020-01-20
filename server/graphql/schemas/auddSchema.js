const { gql } = require('apollo-server-koa');

module.exports = gql`
  extend type Query {
    recogniseByLirics(lyrics: String!): Object!
    recogniseByHumming(humming: String!): Object!
  }
`;