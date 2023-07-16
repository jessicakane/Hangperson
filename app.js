const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.static('public'));

app.use(express.json());

app.use('/', routes);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.nr4unvw.mongodb.net/hangperson?retryWrites=true&w=majority`
    );
    app.listen(3000, () => console.log('Server started on port 3000'));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
