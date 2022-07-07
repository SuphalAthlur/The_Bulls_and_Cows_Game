const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: email,
    required: true
  },
  password: {
    type: password,
    required: true
  }
}, { timestamps: true });

const Users = mongoose.model('User', userSchema);
module.exports = Users;