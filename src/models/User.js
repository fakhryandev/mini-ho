const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  erro: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  kode3: {
    type: String,
    required: true,
  },
  kodeax5: {
    type: String,
    required: true,
  },
  kodeax9: {
    type: String,
    required: true,
  },
  noAhass: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
