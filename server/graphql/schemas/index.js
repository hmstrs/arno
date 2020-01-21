const userSchema = require('./userSchema');
const songSchema = require('./songSchema');
const { gql } = require('apollo-server-koa');

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

module.exports = [linkSchema, userSchema, songSchema];
