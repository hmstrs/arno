const userSchema = require('./userSchema');
const eventSchema = require('./eventSchema');
const { gql } = require('apollo-server-koa');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

module.exports = [linkSchema, userSchema, eventSchema];
