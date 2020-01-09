const { getReviewer, getReviewers } = require('../lib/helpers/data-helper.js');

const request = require('supertest');
const app = require('../lib/app.js');

const Reviewer = require('../lib/models/Reviewer');


describe('reviewer routes tests', () => {

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
    const reviewer = await getReviewer();
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual(
          expect.objectContaining(reviewer)
        );
        res.body.reviews.forEach(review => {
          expect(review).toEqual({
            _id: expect.any(String),
            rating: review.rating,
            review: review.review,
            film: {
              _id: expect.any(String),
              title: expect.any(String)
            }
          });
        });
      });
  });

  it('should be able to get all reviewers', async() => {
    const reviewers = await getReviewers();
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        reviewers.forEach(reviewer => {
          expect(res.body).toContainEqual(reviewer);
        });
      });
  });

  it('should be able to update a reviewer by ID', async() => {
    const reviewer = await getReviewer();
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({ company: 'Metacritic' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: expect.any(String),
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

  it('should throw an error if attempting to delete a reviewer with reviews', async() => {
    const reviewer = await getReviewer();
    return request(app)
      .delete(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body.message).toEqual('Unable to delete reviewer: has reviews.');
      });
  });
});

