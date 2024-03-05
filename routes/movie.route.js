const express = require('express')
const route = express.Router()

const { searchFilms } = require('../controllers/movie.controller')
const auth = require('../middlewares/auth.middleware')

route.get('/search', auth, searchFilms)

module.exports = route