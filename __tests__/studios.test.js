
const { getStudio, getStudios } = require('../lib/helpers/data-helper.js');

const request = require('supertest');
const app = require('../lib/app.js');

describe('studio route tests', () => {

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
    const studio = await getStudio();

    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual(
          expect.objectContaining(studio)
        );
        res.body.films.forEach(film => {
          expect(film).toEqual({
            _id: expect.any(String),
            title: expect.any(String)
          });
        });
      });
  });

  it('should be able to get all studios', async() => {
    const studios = await getStudios();
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        studios.forEach(studio => {
          expect(res.body).toContainEqual({
            _id: studio._id,
            name: studio.name
          });
        });
      });
  });
});
