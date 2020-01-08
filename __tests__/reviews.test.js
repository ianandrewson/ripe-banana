require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app.js');
const connect = require('../lib/utils/connect.js');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review.js');
const Film = require('../lib/models/Film.js');
const Studio = require('../lib/models/Studio.js');
const Reviewer = require('../lib/models/Reviewer.js');

describe('review route tests', () => {
  
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio;
  let film;
  let reviewer;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Universal Studios'
    });

    film = await Film.create({
      title: 'Moon',
      studio,
      released: '2009'
    });

    reviewer = await Reviewer.create({
      name: 'Yuri',
      company: 'Critico'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  
  it('should be able to get all reviews', async() => {
    const reviews = await Review.create([
      { rating: 4, reviewer, review: 'yay', film },
      { rating: 3, reviewer, review: 'Ok', film },
      { rating: 2, reviewer, review: 'meh', film }
    ]);
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        reviews.forEach(review => {
          expect(res.body).toContainEqual({
            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            film: { _id: review.film._id.toString(), title: review.film.title }
          });
        });
      });
  });

  it('should be able to delete a review by ID', async() => {
    const review = await Review.create({
      rating: 5,
      reviewer: new mongoose.Types.ObjectId(),
      review: 'hella good',
      film: new mongoose.Types.ObjectId()
    });
    return request(app)
      .delete(`/api/v1/reviews/${review._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: review._id.toString(),
          rating: 5,
          reviewer: review.reviewer.toString(),
          review: 'hella good',
          film: review.film.toString(),
          __v: 0
        });
      });
  });
});
