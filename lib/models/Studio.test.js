require('dotenv').config();
const app = require('../app.js');
const mongoose = require('mongoose');
const request = require('supertest');
const Studio = require('../models/Studio');

// {
//   name: <name-of-studio RS>,
//   address: {
//   city: <city S>
//   state: <state S>
//   country: <country S>
//   }
// }


describe('Studio model tests', () => {
  it('should have a required name field', => () {
    const studio = new Studio();
    const { errors } = studio.validateSync();
    expect(errors.name.message).toEqual(`Path 'name' is required.`)
  });

  it('should be able to create a new instance of the model', () => {
    const studio = new Studio({
      name: 'Universal Studios',
      address: { city: 'Universal City', 
      state: 'California', 
      country: 'United States'}
    });
    expect(studio).toEqual({
      _id: expect.any(String),
      name: 'Universal Studios',
      address: {
        _id: expect.any(String);
        city: 'Universal City',
        state: 'California',
        country: 'United States'
      }
    });
  });
});
