const moongose = require('mongoose');

const connectDB = (uri) => {
  console.log('connectinng to DB..');
  return moongose.connect(uri);
};

module.exports = connectDB;
