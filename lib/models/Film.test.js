const Film = require('../models/Film.js');
const mongoose = require('mongoose');

// {
//   title: <title of film RS>,
//   studio: <studio _id RI>,
//   released: <4-digit year RN>,
//   cast: [{
//   role: <name of character S>,
//   actor: <actor _id RI>
//   }]
// }

describe('Film model tests', () => {

  it('should have a required title', () => {
    const film = new Film();
    const { errors } = film.validateSync();
    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('should have a required studio ID', () => {
    const film = new Film();
    const { errors } = film.validateSync();
    expect(errors.studio.message).toEqual('Path `studio` is required.');
  });

  it('should have a required 4 digit year release date', () => {
    const film = new Film()
    const { errors } = film.validateSync();
    expect(errors.released.message).toEqual('Path `released` is required.');
  });

  it('can make a new film, and film.cast has a required actor', () => {
    const film = new Film({
      title: 'Some Superhero Trope',
      studio: new mongoose.Types.ObjectId(),
      released: 2018,
    });
    film.cast = [{ role: 'The Error' }];
    const { errors } = film.validateSync();
    expect(errors['cast.0.actor'].message).toEqual('Path `actor` is required.');
    film.cast = [{ role: 'The Tick', actor: new mongoose.Types.ObjectId() }];
    expect(film.toJSON()).toEqual({
      _id: expect.any(mongoose.Types.ObjectId),
      title: 'Some Superhero Trope',
      studio: expect.any(mongoose.Types.ObjectId),
      released: 2018,
      cast: [{ _id: expect.any(mongoose.Types.ObjectId), role: 'The Tick', actor: expect.any(mongoose.Types.ObjectId) }]
    });
  });
});
