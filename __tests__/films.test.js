const { getFilm, getFilms } = require('../lib/helpers/data-helper.js');

const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');

describe('films route tests', () => {
  it('can post a new film', async() => {
    const studio = new mongoose.Types.ObjectId();
    return request(app)
      .post('/api/v1/films')
      .send({
        title: 'Moon',
        studio,
        released: 2009
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Moon',
          studio: studio._id.toString(),
          released: 2009,
          cast: [],
          __v: 0
        });
      });
  });

  it('can get a film by ID', async() => {
    const film = await getFilm();

    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual(
          expect.objectContaining({ ...film, studio: {
            _id: expect.any(String),
            name: expect.any(String)
          } })
        );
        res.body.reviews.forEach(review => {
          expect(review).toEqual({
            _id: expect.any(String),
            rating: expect.any(Number),
            review: expect.any(String),
            reviewer: {
              _id: expect.any(String),
              name: expect.any(String)
            }
          });
        });
      });
  });

  it('can get all films', async() => {
    await getFilms();
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        res.body.forEach(film => {
          expect(film).toEqual(
            expect.objectContaining({
              _id: film._id,
              title: film.title,
              released: film.released,
              studio: { _id: film.studio._id, name: film.studio.name },
              __v: 0,
            })
          );
        });
      });
  });

});
