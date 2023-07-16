const mongoose = require('mongoose');

const QuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'questions',
  }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: false,
    },
    gamesPlayed: {
      type: Number,
      required: false,
    },
    gamesWon: {
      type: Number,
      required: false,
    },
  },
  {
    collection: 'users',
  }
);

const Question = mongoose.model('Question', QuestionsSchema);
const User = mongoose.model('Users', UserSchema);

module.exports = { Question, User };
