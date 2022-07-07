const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  victor: {
    type: String,
    required: true
  },
  turns: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;