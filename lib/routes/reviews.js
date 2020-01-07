const { Router } = require('express');
const Review = require('../models/Review.js');

module.exports = Router()
  .get('/', (req, res, next) => {
    Review
      .find()
      .limit(100)
      .sort('desc')
      .select({ rating: true, review: true, film: true })
      .lean()
      .then(review => res.send(review))
      .catch(next);
  });

