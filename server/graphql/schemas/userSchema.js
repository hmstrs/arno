const { gql } = require('apollo-server-koa');

module.exports = gql`
  type User {
    id: ID!
    name: String!
  }

  type Token {
    token: String!
  }

  extend type Query {
    user(id: ID!): User!
    login(name: String!, password: String!): Token!
  }

  extend type Mutation {
    createUser(name: String!, password: String!, email: String!): User!
    addGame(id: ID!): User!
    addFavourites(id: ID!): User!
  }
`;
