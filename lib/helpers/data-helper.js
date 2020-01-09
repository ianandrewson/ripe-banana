require('dotenv').config();
const connect = require('../utils/connect.js');
const mongoose = require('mongoose');
const seed = require('./seed.js');
const Actor = require('../models/Actor.js');
const Studio = require('../models/Studio.js');
const Film = require('../models/Film.js');
const Reviewer = require('../models/Reviewer.js');
const Review = require('../models/Review.js');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed();
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
  const modelName = Model.modelName;

  return {
    [`get${modelName}`]: () => Model.findOne().then(prepare),
    [`get${modelName}s`]: () => Model.find().then(docs => docs.map(prepare))
  };
};

module.exports = {
  ...createGetters(Actor),
  ...createGetters(Studio),
  ...createGetters(Film),
  ...createGetters(Reviewer),
  ...createGetters(Review)
};
