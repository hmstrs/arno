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

  type Listened {
    listened: Int!
  }

  type Favourited {
    favourited: Int!
  }

  extend type Query {
    add(id: ID!): User!
  }

  extend type Mutation {
    addListened(reference: String!): Listened!
    addFavorited(reference: String!): Favourited!
    addSong(reference: String!, title: String!, artist: String): Song!
  }
`;
