const mongoose = require('mongoose');
const Reviewer = require('../models/Reviewer.js');

//required: name and company

describe('Reviewer model tests', () => {
  it('should have a required name field', () => {
    const reviewer = new Reviewer();
    const { errors } = reviewer.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });

  it('should have a required company field', () => {
    const reviewer = new Reviewer();
    const { errors } = reviewer.validateSync();
    expect(errors.company.message).toEqual('Path `company` is required.');
  });

  it('should be able to make a new reviewer', () => {
    const reviewer = new Reviewer({
      name: 'Max Reginald',
      company: 'San Francisco Chronicle'
    });
    expect(reviewer.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      name: 'Max Reginald',
      company: 'San Francisco Chronicle'
    });
  });
});
