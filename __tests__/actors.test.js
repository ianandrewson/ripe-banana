require('dotenv').config();
const connect = require('../lib/utils/connect.js');
const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor.js');

//get: _id, name
//get/:id: name, dob, pob, films: [{ id, title, released }]
//post
//

describe('actor routes tests', () => {

  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

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

  //update to also send associated films
  it('should be able to get an actor by ID', async() => {
    const date = new Date('4/16/1889');
    const actor = await Actor.create({
      name: 'Charlie Chaplin',
      dob: date,
      pob: 'London, England'
    });
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: actor._id.toString(),
          name: 'Charlie Chaplin',
          dob: date.toISOString(),
          pob: 'London, England',
          __v: 0
        });
      });
  });

  it('should be able to get all actors', async() => {
    const date1 = new Date('1/1/1990');
    const date2 = new Date('1/5/1975');
    const date3 = new Date('5/23/1964');
    const actors = await Actor.create([
      { name: 'Some Dude', dob: date1, pob: 'Copenhagen, Denmark' },
      { name: 'Other Person', dob: date2, pob: 'Nome, Alaska' },
      { name: 'A Fair lady', dob: date3, pob: 'Portland, Oregon' }
    ]);
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        actors.forEach(actor => {
          expect(res.body).toContainEqual({
            _id: actor._id.toString(),
            name: actor.name
          });
        });
      });
  });
});
