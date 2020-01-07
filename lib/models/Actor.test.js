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
    expect(errors.dob.message).toEqual('Path `dob` is required.');
  });

  it('should have a required placeOfBirth field', () => {
    const actor = new Actor();
    const { errors } = actor.validateSync();
    expect(errors.pob.message).toEqual('Path `pob` is required.');
  });

  it('should be able to make a new Actor', () => {
    let date = new Date('4/16/1889')
    const actor = new Actor({
      name: 'Charlie Chaplin',
      dob: date,
      pob: 'London, England'
    });
    expect(actor.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Charlie Chaplin',
      dob: date,
      pob: 'London, England'
    });
  });
});
