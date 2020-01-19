const { gql } = require('apollo-server-koa');

module.exports = gql`
  type Event {
    id: ID!
    title: String!
    content: String!
    owner: User!
  }

  extend type Query {
    event(id: ID!): Event!
    events: [Event!]!
  }

  extend type Mutation {
    createEvent(title: String!, content: String!): Event!
  }
`;
