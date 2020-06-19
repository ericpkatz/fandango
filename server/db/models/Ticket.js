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
      const movie = await db.models.movie.findByPk(ticket.movieId);
      movie.ticketCount++; 
      await movie.save();
    }
  }
})

module.exports = Ticket
