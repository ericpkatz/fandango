'use strict'

const db = require('../server/db')
const {User, Ticket, Movie } = require('../server/db/models')

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  const users = await Promise.all([
    User.create({email: 'cody@email.com', password: '123'}),
    User.create({email: 'murphy@email.com', password: '123'})
  ])

  const [godfather, harryMetSally] = await Promise.all([
    Movie.create({ title: 'The Godfather' }),
    Movie.create({ title: 'When Harry Met Sally' })
  ]);

  const tickets = [];
  while(tickets.length < 1000){
    tickets.push(Ticket.create({ movieId: godfather.id}));
  }

  /*
  let chain = Promise.resolve();

  const inserted = [];

  while(tickets.length){
    const ticket = tickets.shift();
    chain = chain.then(async()=> {
      const insertedTicket = await Ticket.create(ticket)
      inserted.push(insertedTicket);
    });
    
  }

  await chain; 
  */

  const inserted = await Promise.all(tickets);
  console.log(inserted.map(ticket => ticket.id));

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
