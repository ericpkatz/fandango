const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')
const { UUID, UUIDV4 } = Sequelize;


const Ticket = db.define('ticket', {
  id : {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  }
}, {
  hooks: {
    afterCreate: async (ticket)=> {
      /*
      const movie = await db.models.movie.findByPk(ticket.movieId);
      console.log(movie.updatedAt);
      movie.ticketCount++; 
      await movie.save();
      */
      try {
        await db.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ}, async(t)=> {
          console.log(t.id);
          const movie = await db.models.movie.findByPk(ticket.movieId, { transaction: t});
          console.log(t.id);
          movie.ticketCount++; 
          await movie.save({ transaction: t});
        });
      }
      catch(ex){
        console.log(ex.message);
      }
    }
  }
})

module.exports = Ticket
