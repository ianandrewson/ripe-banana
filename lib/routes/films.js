const { Router } = require('express');
const Film = require('../models/Film.js');

module.exports = Router()

  .post('/', (req, res, next) => {
    Film
      .create(req.body)
      .then(film => res.send(film))
      .catch(next);
  })

  //update to return reviews virtual
  .get('/:id', (req, res, next) => {
    Film
      .findById(req.params.id)
      .populate('studio', 'name')
      .lean()
      .then(film => res.send(film))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Film
      .find()
      .select({ cast: false })
      .populate('studio', 'name')
      .lean()
      .then(films => res.send(films))
      .catch(next);
  });
