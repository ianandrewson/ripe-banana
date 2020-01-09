const { getReview, getReviews } = require('../lib/helpers/data-helper.js');

const request = require('supertest');
const app = require('../lib/app.js');

describe('review route tests', () => {
  
  it('should be able to get all reviews', async() => {
    const reviews = await getReviews();
    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        console.log(res.body);
        res.body.forEach(review => {
          //console.log(review);
          expect(review).toEqual({
            _id: expect.any(String),
            rating: expect.any(Number),
            review: expect.any(String),
            film: {
              _id: expect.any(String),
              title: expect.any(String)
            }
          });
        });
      });
  });

  it('should be able to delete a review by ID', async() => {
    const review = await getReview();
    return request(app)
      .delete(`/api/v1/reviews/${review._id}`)
      .then(res => {
        expect(res.body).toEqual(review);
      });
  });
});
