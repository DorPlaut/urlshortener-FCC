const mongoose = require('mongoose');
require('mongoose-type-url');

const LinkSchema = new mongoose.Schema({
  original_url: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  short_url: {
    type: Number,
    unique: true,
  },
});

module.exports = new mongoose.model('Link', LinkSchema);
