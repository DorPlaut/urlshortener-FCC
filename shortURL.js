const mongoose = require('mongoose');
require('mongoose-type-url');

const LinkSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number,
});

module.exports = new mongoose.model('Link', LinkSchema);
