const chance = require('chance').Chance();
const Actor = require('../models/Actor.js');
const Studio = require('../models/Studio.js');
const Film = require('../models/Film.js');
const Reviewer = require('../models/Reviewer.js');
const Review = require('../models/Review.js');

module.exports = async({ actor = 20, studio = 5, film = 50, reviewer = 10, review = 100 } = {}) => {
  const actors = await Actor.create([...Array(actor)].map(() => ({
    name: chance.name(),
    dob: chance.date(),
    pob: `${chance.city()}, ${chance.country()}`
  })));

  const studios = await Studio.create([...Array(studio)].map(() => ({
    name: `${chance.word()} Studios`,
    address: {
      city: chance.city(),
      state: chance.state(),
      country: 'United States'
    }
  })));

  const films = await Film.create([...Array(film)].map(() => ({
    title: chance.word(),
    studio: chance.pickone(studios.map(studio => studio._id)),
    released: Number(chance.year({ min: 1880, max: 2020 })),
    cast: [...Array(chance.natural({ min: 1, max: actor }))].map(() => ({
      role: chance.word(),
      actor: chance.pickone(actors.map(actor => actor._id))
    }))
  })));

  const reviewers = await Reviewer.create([...Array(reviewer)].map(() => ({
    name: chance.name(),
    company: chance.word()
  })));

  await Review.create([...Array(review)].map(() => ({
    rating: chance.natural({ min: 1, max: 5 }),
    reviewer: chance.pickone(reviewers.map(reviewer => reviewer._id)),
    review: chance.sentence({ words: 5 }),
    film: chance.pickone(films.map(film => film._id))
  })));
};
