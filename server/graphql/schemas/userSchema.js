const { gql } = require('apollo-server-koa');

module.exports = gql`
  type Game {
    win: Boolean!
    song: ID!
    tries: Int!
    offered: [ID!]!
    favourites: [ID!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    games: [Game!]!
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
    addGame(id: ID!): User!
    addFavourites(id: ID!): User!
    resetPassword(email: String!): Boolean!
  }
`;
