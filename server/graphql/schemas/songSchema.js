const { gql } = require('apollo-server-koa');

module.exports = gql`
  type Song {
    id: ID!
    reference: String!
    title: String!
    artist: String!
    listened: Int!
    favourited: Int!
  }

  extend type Query {
    getTopSongs: [Song!]!
    checkInFavourites(id: ID!): Boolean!
    getSong(id: ID!): Song!
  }

  extend type Mutation {
    addSong(reference: String!, title: String!, artist: String): Song!
    addFavourited(reference: String!): Song!
  }
`;
