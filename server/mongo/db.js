const mongoose = require('mongoose');

const initDB = () => {
  mongoose.connect(process.env.MONGO, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once('open', () => {
    console.log('✅ Connected to database');
  });
};

module.exports = initDB;
