const express = require('express');
const MoviesService = require('../services/movies.js');

function movies(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const moviesService = new MoviesService();

  router.get('/:id', async function (req, res, next) {
    const { id } = req.params;
    try {
      const movies = await moviesService.getMovie(id);
      res.status(200).json({
        movies
      })
    } catch (err) {
      next(err);
      res.status(400).json({
        error: `${err.message}`
      });
    }
  });
}

module.exports = { movies };