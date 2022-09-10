const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cardSchema.path('link').validate((val) => {
  const urlRegex = /((http|ftp|https):\/\/)?(([\w.-]*)\.([\w]*))/;
  return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = mongoose.model('card', cardSchema);
