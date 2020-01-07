require('dotenv').config();
const connect = require('../lib/utils/connect.js');
const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor.js');

describe('actor routes tests', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('')
});
