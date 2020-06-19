const router = require('express').Router()
const {User, Movie} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.findAll({})
    res.json(movies)
  } catch (err) {
    next(err)
  }
})
