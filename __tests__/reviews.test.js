require('dotenv').config();
const request = require('supertest');
const app = require('../lib/app.js');
const connect = require('../lib/utils/connect.js');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review.js');

//getAll, limit to 100

describe('review route tests', () => {
  
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  
  it('should be able to get all reviews', async() => {
    const reviews = await Review.create([
      { rating: 4, reviewer: new mongoose.Types.ObjectId(), review: 'yay', film: new mongoose.Types.ObjectId() },
      { rating: 3, reviewer: new mongoose.Types.ObjectId(), review: 'Ok', film: new mongoose.Types.ObjectId() },
      { rating: 2, reviewer: new mongoose.Types.ObjectId(), review: 'meh', film: new mongoose.Types.ObjectId() }
    ]);
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        reviews.forEach(review => {
          expect(res.body).toContainEqual({
            _id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            film: review.film.toString()
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
