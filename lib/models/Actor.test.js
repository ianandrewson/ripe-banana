const Actor = require('../models/Actor.js');
const mongoose = require('mongoose');

// {
//   name: <name RS>,
//   dob: <date-of-birth D>,
//   pob: <place-of-birth S>
//}

describe('Actor model tests', () => {
  
  it('should have a required name field', () => {
    const actor = new Actor();
    const { errors } = actor.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('should should have a required dateOfBirth field', () => {
    const actor = new Actor();
    const { errors } = actor.validateSync();
    expect(errors.dateOfBirth.message).toEqual('Path `dateOfBirth` is required.');
  });

  it('should have a required placeOfBirth field', () => {
    const actor = new Actor();
    const { errors } = actor.validateSync();
    expect(errors.placeOfBirth.message).toEqual('Path `placeOfBirth` is required.');
  });

  it('should be able to make a new Actor', () => {
    const actor = new Actor({
      name: 'Charlie Chaplin',
      dateOfBirth: new Date('4/16/1889'),
      placeOfBirth: 'London, England'
    });
    expect(actor.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Charlie Chaplin',
      dateOfBirth: '1889-04-16T00:00:00.000Z',
      placeOfBirth: 'London, England'
    });
  });
});
