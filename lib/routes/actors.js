const { Router } = require('express');
const Actor = require('../models/Actor.js');

module.exports = Router()

  .post('/', (req, res, next) => {
    Actor
      .create(req.body)
      .then(actor => res.send(actor))
      .catch(next);
  })

  //update to populate with films
  .get('/:id', (req, res, next) => {
    Actor
      .findById(req.params.id)
      .populate({
        path: 'films',
        select: 'title _id released' 
      })
      .lean()
      .then(actor => {
        actor.films.forEach(film => {
          delete film.cast;
        });
        res.send(actor);
      })
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ name: true })
      .lean()
      .then(actors => res.send(actors))
      .catch(next);
  });
