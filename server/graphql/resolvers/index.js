const userResolver = require('./userResolvers');
const songResolver = require('./songResolver');
const auddResolver = require('./auddResolvers');

module.exports = [userResolver, songResolver, auddResolver];
