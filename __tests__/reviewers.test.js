require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app.js');
const Reviewer = require('../lib/models/Reviewer.js');
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect.js');

describe('reviewer routes tests', () => {

  beforeAll(() => {
    connect();
  });

  beforeAll(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to post a new reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({
        name: 'Burt',
        company: 'Review Co'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Burt',
          company: 'Review Co',
          __v: 0
        });
      });
  });

  it('should be able to get a reviewer by ID', async() => {
    const reviewer = await Reviewer.create({
      name: 'Burt',
      company: 'Review Co'
    });
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Burt',
          company: 'Review Co',
          __v: 0
        });
      });
  });

  it('should be able to get all reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'Burt', company: 'Review Co' },
      { name: 'Reggie', company: 'Film Critic' },
      { name: 'Annie', company: 'Boston Globe' }
    ]);
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        reviewers.forEach(reviewer => {
          expect(res.body).toContainEqual({
            _id: reviewer._id.toString(),
            name: reviewer.name,
            company: reviewer.company,
            __v: 0
          });
        });
      });
  });

  it('should be able to update a reviewer by ID', async() => {
    const reviewer = await Reviewer.create({
      name: 'Burt',
      company: 'Review Co'
    });
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({ company: 'Metacritic' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Burt',
          company: 'Metacritic',
          __v: 0
        });
      });
  });

  it('should be able to delete a reviewer by ID', async() => {
    const reviewer = await Reviewer.create({
      name: 'Burt',
      company: 'Review Co'
    });
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Burt',
          company: 'Review Co',
          __v: 0
        });
      });
  });

  it.skip('should throw an error if attempting to delete a reviewer if they have no reviews', () => {

  });

});

