require('dotenv').config();
const connect = require('../lib/utils/connect.js');
const request = require('supertest');
const app = require('../lib/app.js');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio.js');
const Film = require('../lib/models/Film.js');

describe('studio route tests', () => {
  
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to post a new Studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({
        name: 'Universal Studios',
        address: { 
          city: 'Universal City', 
          state: 'California', 
          country: 'United States'
        }
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Universal Studios',
          address: {
            _id: expect.any(String),
            city: 'Universal City',
            state: 'California',
            country: 'United States'
          },
          __v: 0
        });
      });
  });

  it('should be able to get a studio by id', async() => {
    const studio = await Studio.create({
      name: 'Universal Studios',
      address: { 
        city: 'Universal City', 
        state: 'California', 
        country: 'United States'
      }
    });

    const films = await Film.create([
      { title: 'Moon', studio, released: 2009 },
      { title: 'Planet Earth', studio, released: 2011 }
    ]);
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Universal Studios',
          address: { 
            _id: expect.any(String),
            city: 'Universal City', 
            state: 'California', 
            country: 'United States'
          },
          films: [
            { _id: films[0]._id.toString(), title: films[0].title },
            { _id: films[1]._id.toString(), title: films[1].title }
          ],
          __v: 0
        });
      });
  });

  it('should be able to get all studios', async() => {
    const studios = await Studio.create([
      { name: 'Universal Studios' },
      { name: 'Paramount Pictures' },
      { name: 'Lionsgate Films' }
    ]);
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        studios.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id.toString(),
            name: studio.name
          });
        });
      });
  });
});
