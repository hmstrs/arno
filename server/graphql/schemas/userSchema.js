const { gql } = require('apollo-server-koa');

module.exports = gql`
  type User {
    id: ID!
    name: String!
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
    resetPassword(email: String!) : null
  }
`;
