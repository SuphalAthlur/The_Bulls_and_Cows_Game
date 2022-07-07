const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ongameSchema = new Schema ({
  sys: {
    type: [Number],
    required: true
  },
  sysDig: {
    type: [[Number],[Number],[Number],[Number]],
    required: true
  },
  pFirst: {
    type: Boolean,
    required: true
  },
  coin: {
    type: Boolean,
    required: true
  },
  verdict: {
    type: Boolean,
    required: true
  },
  player: {
    type: String,
    required: true
  },
  system: {
    type: String,
    required: true
  },
  sysInd: {
    type: Number,
    required: true
  },
  sysNum: {
    type: Number,
    required: true
  }
}, { timestamps: true });
const gameDeet = mongoose.model('gameDeet', ongameSchema);

const sysq = new Schema ({
  turn: {
    type: Number,
    required: true
  },
  query: {
    type: Number,
    required: true
  }
});
const sysQuery = mongoose.model('sysQuery', sysq);

const userq = new Schema ({
  turn: {
    type: Number,
    required: true
  },
  query: {
    type: Number,
    required: true
  }
});
const userQuery = mongoose.model('userQuery', userq);

const st = new Schema ({
  valid: {
    type: [Boolean],
    required: true
  },
  sysQ: {
    type: Number,
    required: true
  },
  userQ: {
    type: Number,
    required: true
  },
  turn: {
    type: Number,
    required: true
  },
  victor: {
    type: Number,
    required: true
  }
});
const gameStat = mongoose.model('gameStat', st);

module.exports = {gameStat, gameDeet, sysQuery, userQuery};