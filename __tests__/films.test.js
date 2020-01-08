require('dotenv').config();
const connect = require('../lib/utils/connect.js');
const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film.js');
const Studio = require('../lib/models/Studio.js');
const Review = require('../lib/models/Review.js');
const Reviewer = require('../lib/models/Reviewer.js');


describe('film routes tests', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio;
  beforeEach(async() => {
    studio = await Studio.create({
      name: 'Universal Studios'
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can post a new film', () => {
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

  //need to update to have reviews virtual: {id, rating review, reviewer: {id, name}}
  it('can get a film by ID', async() => {
    const film = await Film.create({
      title: 'Moon',
      studio: studio,
      released: 2009
    });

    const reviewer = await Reviewer.create({
      name: 'Bob',
      company: 'Critico'
    });

    const review = await Review.create({
      rating: 5,
      reviewer,
      review: 'Two thumbs up',
      film
    });

    return request(app)
      .get(`/api/v1/films/${film.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: film._id.toString(),
          title: 'Moon',
          studio: { _id: studio._id.toString(), name: studio.name },
          released: 2009,
          cast: [],
          reviews: [{
            _id: review._id.toString(),
            rating: 5,
            review: review.review,
            reviewer: {
              _id: reviewer._id.toString(),
              name: 'Bob'
            }
          }],
          __v: 0
        });
      });
  });

  it('can get all films', async() => {
    const films = await Film.create([
      { title: 'Moon', studio, released: 2009 },
      { title: 'Planet Earth', studio, released: 2010 },
      { title: 'Sol', studio, released: 2000 }
    ]);
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        films.forEach(film => {
          expect(res.body).toContainEqual({
            _id: film._id.toString(),
            title: film.title,
            studio: { _id: studio._id.toString(), name: studio.name },
            released: film.released,
            __v: 0
          });
        });
      });
  });

});
