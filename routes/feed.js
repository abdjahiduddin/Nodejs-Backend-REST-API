const express = require('express')

// Import Controllers
const feedController = require('../controllers/feed')

const routes = express.Router()

routes.get('/posts', feedController.getPosts)

routes.post('/post', feedController.createPost)

module.exports = routes