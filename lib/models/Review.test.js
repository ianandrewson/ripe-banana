const Review = require('../models/Review.js');
const mongoose = require('mongoose');

// rating: <rating number 1-5 RN>,
// reviewer: <review _id RI>
// review: <review-text, max-length 140 chars RS>,
// film: <film-id RI></film-id>

describe('Review model tests', () => {
  it('has a required rating field', () => {
    const review = new Review();
    const { errors } = review.validateSync();
    expect(errors.rating.message).toEqual('Path `rating` is required.');
  });

  it('has a required reviewer', () => {
    const review = new Review();
    const { errors } = review.validateSync();
    expect(errors.reviewer.message).toEqual('Path `reviewer` is required.');
  });

  it('has a required review', () => {
    const review = new Review();
    const { errors } = review.validateSync();
    expect(errors.review.message).toEqual('Path `review` is required.');
  });
  
  it('has a required film associated with it', () => {
    const review = new Review();
    const { errors } = review.validateSync();
    expect(errors.film.message).toEqual('Path `film` is required.');
  });
  
  it('throws an error if the review is more than 140 chars', () => {
    const review = new Review({
      rating: 5,
      reviewer: new mongoose.Types.ObjectId(),
      review: 'a'.repeat(141),
      film: new mongoose.Types.ObjectId()
    });
    const { errors } = review.validateSync();
    expect(errors.review.message).toEqual('Review is greater than maximum allowed length(140).');
  });

  it('should be able to make a new review', () => {
    const review = new Review({
      rating: 5,
      reviewer: new mongoose.Types.ObjectId(),
      review: 'test review',
      film: new mongoose.Types.ObjectId()
    });
    expect(review.toJSON()).toEqual({
      _id: review._id.toString(),
      rating: 5,
      reviewer: review.reviewer.toString(),
      review: 'test review',
      film: review.reviewer.toString()
    });
  });
});

