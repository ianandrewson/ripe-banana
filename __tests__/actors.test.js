const { getActor, getActors } = require('../lib/helpers/data-helper.js');

const request = require('supertest');
const app = require('../lib/app.js');

describe('actor routes tests', () => {
  it('should be able to post a new actor', async() => {
    let date = new Date('4/16/1889');
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Charlie Chaplin', dob: date, pob: 'London, England' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Charlie Chaplin',
          dob: date.toISOString(),
          pob: 'London, England',
          __v: 0
        });
      });
  });

  it('should be able to get an actor by ID', async() => {
    const actor = await getActor();
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual(
          expect.objectContaining(actor)
        );
        res.body.films.forEach(film => {
          expect(film).toEqual({
            _id: expect.any(String),
            released: expect.any(Number),
            title: expect.any(String)
          });
        });
      });
  });

  it('should be able to get all actors', async() => {
    const actors = await getActors();
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        actors.forEach(actor => {
          expect(res.body).toContainEqual({
            _id: actor._id,
            name: actor.name
          });
        });
      });
  });
});
