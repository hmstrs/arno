const { Types } = require('mongoose');
const { ObjectId } = Types;

module.exports = id => ObjectId.isValid(id);
