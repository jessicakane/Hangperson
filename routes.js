const express = require('express');
const { Question, User } = require('./models');

const router = express.Router();

router.get('/questions', async (req, res) => {
  const allQuestions = await Question.find();
  return res.status(200).json(allQuestions);
});

router.get('/questions/:category/random', async (req, res) => {
  const { category } = req.params;

  try {
    const count = await Question.countDocuments({ category }).exec();

    const randomIndex = Math.floor(Math.random() * count);

    const randomQuestion = await Question.findOne({ category })
      .skip(randomIndex)
      .exec();

    if (!randomQuestion) {
      return res
        .status(404)
        .json({ message: 'No questions found in the specified category' });
    }

    return res.status(200).json(randomQuestion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});

router.get('/questions/random', async (req, res) => {
  try {
    const count = await Question.countDocuments().exec();

    const randomIndex = Math.floor(Math.random() * count);

    const randomQuestion = await Question.findOne().skip(randomIndex).exec();

    if (!randomQuestion) {
      return res.status(404).json({ message: 'No questions found' });
    }

    return res.status(200).json(randomQuestion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
});

router.get('/users', async (req, res) => {
  const allUsers = await User.find();
  return res.status(200).json(allUsers);
});

router.post('/users', async (req, res) => {
  const { username } = req.body;

  let existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(200).json(existingUser);
  }

  const newUser = new User({ ...req.body, gamesPlayed: 0, gamesWon: 0 });
  const insertedUser = await newUser.save();

  return res.status(201).json(insertedUser);
});

router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  return res.status(200).json(user);
});

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  await User.updateOne({ _id: id }, req.body);
  const updatedUser = await User.findById(id);
  return res.status(200).json(updatedUser);
});

module.exports = router;
