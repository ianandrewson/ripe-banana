const { Router } = require('express');
const Reviewer = require('../models/Reviewer.js');

//get reviewers, get reviewers by ID, post, put, delete if no reviews

module.exports = Router()
  .post('/', (req, res, next) => {
    Reviewer
      .create(req.body)
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  
  .get('/:id', (req, res, next) => {
    Reviewer
      .findById(req.params.id)
      .populate({
        path: 'reviews', 
        select: '-__v',
        populate: {
          path: 'film',
          select: '_id title'
        }
      })
      .lean()
      .then(reviewer => {
        reviewer.reviews.forEach(review => {
          delete review.reviewer;
        });
        res.send(reviewer);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Reviewer
    //.findByIdAndDelete(req.params.id)
      .findById(req.params.id)
      .populate('reviews')
      .then(reviewer => {
        if(reviewer.reviews.length === 0) {
          Reviewer.deleteOne(reviewer);
          res.send(reviewer);
        } else {
          throw new Error('Unable to delete reviewer: has reviews.');
        }
      })
      .catch(next);
  });
