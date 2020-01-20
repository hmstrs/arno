const { gql } = require('apollo-server-koa');

module.exports = gql`
  type Song {
    id: ID!
    reference: String!
    title: String!
    artist: String!
    listened: Number!
    favourited: Number!
  }

  type Listened {
    listened: Number!
  }

  type Favourited {
    favourited: Number!
  }

  extend type Query {
    add(id: ID!): User!
    login(name: String!, password: String!): Token!
  }

  extend type Mutation {
    addListened(reference: String!): Listened!
    addFavourited(reference: String!): Favourited!
    addSong(reference: String!, title: String!, artist: String): Song!
  }
`;
