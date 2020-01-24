const { gql } = require('apollo-server-koa');

module.exports = gql`
  input OfferedSongInput {
    reference: String!
    title: String!
    artist: String!
  }

  type OfferedSongOutput {
    _id: ID!
    reference: String!,
    artist: String!
    title: String!
    listened: Int!
    favourited: Int!
  }

  type Game {
    win: Boolean!
    song: OfferedSongOutput!
    tries: Int!
    offered: [OfferedSongOutput!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    games: [Game!]!
    favourites: [OfferedSongOutput!]!
  }
  type Token {
    token: String!
  }

  type Password {
    password: String!
  }

  extend type Query {
    user(id: ID!): User!
    login(email: String!, password: String!): Token!
  }

  extend type Mutation {
    createUser(name: String!, password: String!, email: String!): User!
    addGame(win: Boolean!, song: OfferedSongInput!, tries: Int!, offered: [OfferedSongInput!]!): User!
    addFavourites(id: ID!): User!
    deleteFavourites(id: ID!): User!
    resetPassword(email: String!): Boolean!
    clearGameHistory: User!
  }
`;
